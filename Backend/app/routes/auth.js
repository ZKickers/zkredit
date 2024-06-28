const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middlewares/authMiddleware');
const { validateSignup, validateLogin } = require('../middlewares/authValidation');
require('dotenv').config();

const router = express.Router();

router.post('/signup', validateSignup, async (req, res) => {
  console.log("Calling signup");
  try {
    const { username, email, password } = req.body;

    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
      return res.status(400).send('Username is already taken');
    }

    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).send('Email is already registered');
    }

    const accountId = generateAccountId();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password + salt, 10);

    const user = new User({
      accountId,
      username,
      email,
      password: hashedPassword,
      salt,
    });

    await user.save();
    res.status(201).send('User created successfully');
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Internal server error');
  }
});

router.post('/login', validateLogin, async (req, res) => {
  console.log("Calling login");
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const passwordMatch = await bcrypt.compare(password + user.salt, user.password);
    if (!passwordMatch) {
      return res.status(401).send('Invalid password');
    }

    const token = jwt.sign({
      accountId: user.accountId,
      username: user.username
    }, process.env.JWT_SECRET, { expiresIn: '2d' });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Internal server error');
  }
});

function generateAccountId() {
  return 'acc_' + Math.random().toString(36).substr(2, 9);
}

router.get('/', verifyToken, async (req, res) => {
  console.log("Calling getUsername");
  try {
    const user = await User.findOne({ accountId: req.user.accountId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { username, createdAt, accountId } = user;
    res.json({ username, createdAt, accountId });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(403).json({ message: 'Invalid token.' });
  }
});

module.exports = router;
