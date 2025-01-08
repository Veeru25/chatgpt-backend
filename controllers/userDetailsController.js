const User = require('../models/User');
const jwt = require('jsonwebtoken');
const UserDetails = require('../models/UserDetails');
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
    if (req.user.usertype !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
  }; 

  
  // exports.getUserDetails = async (req, res) => {
  //   try {
  //     const userId = req.user.id;
  
  //     const user = await User.findById(userId).select('-password -userotp');
  //     if (!user) {
  //       return res.status(404).json({ message: 'User not found' });
  //     }
  
  //     const userDetails = await UserDetails.findOne({ userId });
  //     if (!userDetails) {
  //       return res.status(404).json({ message: 'User details not found' });
  //     }
  
  //     res.status(200).json({
  //       message: 'User details retrieved successfully',
  //       userDetails,
  //     });
  //   } catch (error) {
  //     console.error('Error in getUserDetails:', error);
  //     res.status(500).json({ message: 'Server error' });
  //   }
  // };
  
  exports.getUserDetails = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const user = await User.findById(userId).select('email');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const userDetails = await UserDetails.findOne({ userId }).select('-_id -userId -__v');
      if (!userDetails) {
        return res.status(404).json({ message: 'User details not found' });
      }
  
      const filteredUserDetails = Object.fromEntries(
        Object.entries(userDetails.toObject()).filter(([_, value]) => value !== null)
      );
  
      res.status(200).json({
        message: 'User details retrieved successfully',
        userDetails: filteredUserDetails,
      });
    } catch (error) {
      console.error('Error in getUserDetails:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  


  exports.updateUserDetails = async (req, res) => {
    const { mobile, pincode, address } = req.body;
    const userId = req.params.userId;
  
    try {
      // Check if at least one field is provided
      if (!mobile && !pincode && !address) {
        return res.status(400).json({ message: 'At least one field is required to update' });
      }
  
      // Find user details by userId
      let userDetails = await UserDetails.findOne({ userId });
  
      // If user details don't exist, return an error
      if (!userDetails) {
        return res.status(404).json({ message: 'User details not found' });
      }
  
      // Update fields if provided
      if (mobile) userDetails.mobile = mobile;
      if (pincode) userDetails.pincode = pincode;
      if (address) userDetails.address = address;
  
      // Save the updated user details
      await userDetails.save();
  
      res.status(200).json({
        message: 'User details updated successfully',
        userDetails,
      });
    } catch (error) {
      console.error('Error in updateUserDetails:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
  
  
  
  exports.deleteUser = async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Delete the userdetails document
      await UserDetails.findOneAndDelete({ userId });
  
      // Delete the user document
      await User.findByIdAndDelete(userId);
  
      res.status(200).json({ message: 'User account and details deleted successfully' });
    } catch (error) {
      console.error('Error in deleteUser:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
