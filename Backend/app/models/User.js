const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  accountId: { type: String, unique: true },
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  salt: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;