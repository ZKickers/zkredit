const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateSignup, validateLogin } = require('../middlewares/authValidation');
const verifyToken = require("../middlewares/authMiddleware");
require('dotenv').config();

const router = express.Router();

router.post('/signup', validateSignup, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).send('Username is already taken');
    }

    const existingEmail = await User.findOne({ email });
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
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
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

    // Set the token in an HttpOnly, Secure, SameSite cookie
    // res.cookie('token', token, {
    //   httpOnly: true,
    //   secure: true, // Ensures cookie is sent over HTTPS
    //   sameSite: 'Strict'
    // });

    res.status(200).json({ message: 'Login successful', token: token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Internal server error');
  }
});

router.get('/', verifyToken, async (req, res) => {
  console.log("Calling getUsername");
  try {
    const user = await User.findOne({ accountId: req.user.accountId });
    console.log("User: ", user);
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

function generateAccountId() {
  return 'acc_' + Math.random().toString(36).substr(2, 9);
}

module.exports = router;
