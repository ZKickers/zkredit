const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require("../middlewares/authMiddleware");
const verifyRecaptchaToken = require('../middlewares/recaptchaMiddleware')
require('dotenv').config();
const { ERROR_MSG } = require('../Services/errorHandling');
const { errlog, reqlog, successLog } = require('../Services/logging');

const router = express.Router();


router.post('/signup', verifyRecaptchaToken,  async (req, res) => {
  const action = "signup"
  reqlog(action)
    try {
      if (!req.body.username || !req.body.email || !req.body.password) {
        const errorMsg = ERROR_MSG[action].param
        errlog(action,errorMsg)
        return res.status(400).send(errorMsg);
      }
  
      const existingUsername = await User.findOne({ username: req.body.username });
      if (existingUsername) {
        const errorMsg = ERROR_MSG[action].userTaken
        errlog(action,errorMsg)
        return res.status(400).send(errorMsg);
      }
  
      const existingEmail = await User.findOne({ email: req.body.email });
      if (existingEmail) {
        const errorMsg = ERROR_MSG[action].emailTaken
        errlog(action,errorMsg)
        return res.status(400).send(errorMsg);
      }
  
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(req.body.email)) {
        const errorMsg = ERROR_MSG[action].emailInvalid
        errlog(action,errorMsg)
        return res.status(400).send(errorMsg);
      }
  
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
      if (!passwordRegex.test(req.body.password)) {
        const errorMsg = ERROR_MSG[action].weakPassword
        errlog(action,errorMsg)
        return res.status(400).send(errorMsg);
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
      successLog(user.username,action)
      res.status(201).send('User created successfully');
    } catch (error) {
      const errorMsg = ERROR_MSG[action]["unexpected"]
      errlog(action,errorMsg)
      res.status(500).send(errorMsg);
    }
  });
  

router.post('/login', verifyRecaptchaToken,  async (req, res) => {
  const action = 'login'
  reqlog(action)
  try {
      const user = await User.findOne({ username: req.body.username });
  
      if (!user) {
        const errorMsg = ERROR_MSG["userNotFound"]
        errlog(action,errorMsg)
        return res.status(404).send(errorMsg);
      }
      const passwordMatch = await bcrypt.compare(req.body.password + user.salt, user.password);
      if (!passwordMatch) {
        const errorMsg = ERROR_MSG[action].invalidPassword
        errlog(action,errorMsg)
        return res.status(401).send(errorMsg);
      }
  
      const token = jwt.sign({
        accountId: user.accountId,
        username: user.username
      }, process.env.JWT_SECRET, { expiresIn: '2d' });
  
       successLog(user.username,action)
      res.status(200).json({ token });
    } catch (error) {
      errlog(action,error)
      res.status(500).send(ERROR_MSG[action]["unexpected"]);
    }
});
router.get('/', verifyToken, async (req, res) => {
  const action = "fetchUser"
  reqlog(action)
  try {
    const user = await User.findOne({ accountId: req.user.accountId });
    if (!user) {
      const errorMsg = ERROR_MSG["userNotFound"]
      errlog(action,errorMsg)
      return res.status(404).send(errorMsg);
    }
    
    const { username, createdAt, accountId } = user;
    successLog(username,action)
    res.json({ username, createdAt, accountId });
  } catch (error) {
    errlog(action,error)
    res.status(403).send(ERROR_MSG.invalidToken);
  }
});

function generateAccountId() {
  return 'acc_' + Math.random().toString(36).substr(2, 9);
}

module.exports = router;
