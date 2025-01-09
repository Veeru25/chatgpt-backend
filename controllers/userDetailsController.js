const User = require('../models/User');
const jwt = require('jsonwebtoken');
const UserDetails = require('../models/UserDetails');
const { default: mongoose } = require('mongoose');
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

//     const userDetails = await new UserDetails.aggregate([
//       { $match: { userId:new mongoose.Types.ObjectId(userId) } },
//       {
//         $lookup: {
//           from: 'users',
//           localField: 'userId',
//           foreignField: '_id',
//           as: 'user',
//         },
//       },
//       { $unwind: '$user' },
//       {
//         $project: {
//           _id: 0,
//           __v: 0,
//           userId: 0,
//           'user._id': 0,
//           'user.__v': 0,
//           'user.password': 0, 
//         },
//       },
//     ]);

//     if (!userDetails || userDetails.length === 0) {
//       return res.status(404).json({ message: 'User details not found' });
//     }

//     const filteredUserDetails = Object.fromEntries(
//       Object.entries(userDetails[0]).filter(([_, value]) => value !== null)
//     );

//     res.status(200).json({
//       message: 'User details retrieved successfully',
//       userDetails: filteredUserDetails,
//     });
//   } catch (error) {
//     console.error('Error in getUserDetails:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// exports.getUserDetails = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const user = await User.findById(userId).select('email');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const userDetails = await UserDetails.findOne({ userId }).select('-_id -userId -__v');
//     if (!userDetails) {
//       return res.status(404).json({ message: 'User details not found' });
//     }

//     const filteredUserDetails = Object.fromEntries(
//       Object.entries(userDetails.toObject()).filter(([_, value]) => value !== null)
//     );

//     res.status(200).json({
//       message: 'User details retrieved successfully',
//       userDetails :filteredUserDetails,
//     });
//   } catch (error) {
//     console.error('Error in getUserDetails:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("userId",userId)

    const userDetailsId = await UserDetails.findOne({ userId });
    // console.log("userDetailsId",userDetailsId)
    
    if (!userDetailsId.userId) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const userDetails = await UserDetails.aggregate([
      { $match: { userId: userDetailsId.userId } },
      {$project :{
        _id:0,userId:0,__v:0

      }}
     
    ]);

    if (!userDetails || userDetails.length === 0) {
      return res.status(404).json({ message: 'User details not found' });
    }


    res.status(200).json({
      message: 'User details retrieved successfully',
      userDetails,
    });
  } catch (error) {
    console.error('Error in getUserDetails:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getAllUsers = async (req, res) => {

  try {
    const allUsers = await User.aggregate([
      {
        $lookup: {
          from: 'userdetails', 
          localField: '_id', 
          foreignField: 'userId', 
          as: 'userDetails',
        },
      },
      {
        $unwind: {
          path: '$userDetails',
          preserveNullAndEmptyArrays: true, 
        },
      },
      {
        $project: {
          _id: 0, 
          email: 1,
          'userDetails.mobile': 1,
          'userDetails.pincode': 1,
          'userDetails.address': 1,
        },
      },
    ]);

    if (!allUsers || allUsers.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json({
      message: 'All users retrieved successfully',
      users: allUsers,
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateUserDetails = async (req, res) => {
  const { mobile, pincode, address } = req.body;
  const userId = req.params.userId;

  try {
    if (!mobile && !pincode && !address) {
      return res.status(400).json({ message: 'At least one field is required to update' });
    }

    let userDetails = await UserDetails.findOne({ userId });

    if (!userDetails) {
      return res.status(404).json({ message: 'User details not found' });
    }

    if (mobile) userDetails.mobile = mobile;
    if (pincode) userDetails.pincode = pincode;
    if (address) userDetails.address = address;

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


