const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
      if (!req.body.username || !req.body.email || !req.body.password) {
        return res.status(400).send('Username, email, and password are required');
      }
  
      const existingUsername = await User.findOne({ username: req.body.username });
      if (existingUsername) {
        return res.status(400).send('Username is already taken');
      }
  
      const existingEmail = await User.findOne({ email: req.body.email });
      if (existingEmail) {
        return res.status(400).send('Email is already registered');
      }
  
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(req.body.email)) {
        return res.status(400).send('Invalid email format');
      }
  
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
      if (!passwordRegex.test(req.body.password)) {
        return res.status(400).send('Password must be at least 7 characters long and contain at least one uppercase letter, one lowercase letter, and one special character');
      }
      const accountId = generateAccountId();
  
      const salt = await bcrypt.genSalt(10);
  
      const hashedPassword = await bcrypt.hash(req.body.password + salt, 10);
  
      const user = new User({
        accountId,
        username: req.body.username,
        email: req.body.email,
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
  

router.post('/login', async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
  
      if (!user) {
        return res.status(404).send('User not found');
      }
      const passwordMatch = await bcrypt.compare(req.body.password + user.salt, user.password);
      if (!passwordMatch) {
        return res.status(401).send('Invalid password');
      }
  
      const token = jwt.sign({ 
        accountId: user.accountId,
        username: user.username
       }, 'secret');
  
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).send('Internal server error');
    }
  });
  
function generateAccountId() {
  return 'acc_' + Math.random().toString(36).substr(2, 9);
}

router.get('/', async (req, res) => {
  const token = req.header('Authorization');

  if (!token) {
      return res.status(401).json({ message: 'Access denied. Token is required.' });
  }

  try {
      console.log("verifying token...")
      const user = jwt.verify(token, 'secret');
      console.log("verifyied token")
      res.json(user);
  } catch (error) {
      console.error('Error verifying token:', error);
      res.status(403).json({ message: 'Invalid token.' });
  }
});


module.exports = router;
