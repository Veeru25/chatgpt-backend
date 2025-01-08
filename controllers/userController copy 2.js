const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;


exports.authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; 
      next();
    } catch (error) {
      console.error('Error in authentication:', error);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
  

exports.isAdmin = (req, res, next) => {
    if (!req.user.usertype.admin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
  };  

  
  exports.getUserDetails = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password -userotp'); 
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({
        message: 'User details retrieved successfully',
        user,
      });
    } catch (error) {
      console.error('Error in getUserDetails:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  


  exports.updateUserDetails = async (req, res) => {
    const { mobile, pincode } = req.body;
  
    if (!mobile && !pincode) {
      return res.status(400).json({ message: 'At least one of mobile number or pincode is required' });
    }
  
    try {
      const user = await User.findById(req.params.userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      
      if (mobile) {
        user.mobile = mobile;
      }
      if (pincode) {
        user.pincode = pincode;
      }
  
      await user.save();
  
      res.status(200).json({
        message: 'User details updated successfully',
        user: {
          username: user.username,
          email: user.email,
          mobile: user.mobile,
          pincode: user.pincode,
        },
      });
    } catch (error) {
      console.error('Error in updateUserDetails:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
  
  exports.deleteUser = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      await User.findByIdAndDelete(req.user.id);
  
      res.status(200).json({ message: 'User account deleted successfully' });
    } catch (error) {
      console.error('Error in deleteUser:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
