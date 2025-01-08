const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: false,
  },
  mobile: {
    type: String,
    required: false,
  },
  pincode: {
    type: String,
    required: false,
    
  },
  address: {
    type: String,
    required: false,
  },
});

const UserDetails = mongoose.models.userdetails || mongoose.model('userdetails', userDetailsSchema);

module.exports = UserDetails;
