const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userotp: {
      type: String,
      required: false,
    }
  });
  

const User = mongoose.models.user || mongoose.model('user', userSchema)   

module.exports = User

