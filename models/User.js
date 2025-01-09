const mongoose = require('mongoose');

// const userRoles = ['admin']

const userSchema = new mongoose.Schema({
    username: { 
      type: String,
      required: true,
    },
    usertype: {
      type: String,
      enum: ["user"],  
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

  userSchema.pre('save', function(next) {
    if (this.email) {
      this.email = this.email.toLowerCase();  
    }
    next();
  });
  

const User = mongoose.models.user || mongoose.model('user', userSchema)   

module.exports = User

