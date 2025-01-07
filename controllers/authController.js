const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET;

let nanoid;
(async () => {
  ({ nanoid } = await import('nanoid'));
})();

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  const emailLowerCase = email.toLowerCase()

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email:emailLowerCase }] });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: { username, email } });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const emailLowerCase = email.toLowerCase()

  try {
    const user = await User.findOne({ email:emailLowerCase });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email.toLowerCase(), username: user.username },
      JWT_SECRET,
      { expiresIn: '30m' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.forgotpassword = async (req, res) => {
  const { email } = req.body;
  
  const emailLowerCase = email.toLowerCase()

  try {
    const existingUser = await User.findOne({ email:emailLowerCase });

    if (!existingUser) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const forgotpasswordtoken = jwt.sign(
      { email:emailLowerCase },
      process.env.JWT_SECRET , 
      { expiresIn: '5m' } 
    );

    const otp = Math.random().toString().slice(2, 6);

    await User.findOneAndUpdate(
      { email },
      { userotp: otp }
    );


    const mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'veeruadimulam@gmail.com', 
        pass: 'hxrc ivza tgiz tcmn', 
      },
    });


    const mailDetails = {
      from: 'veeruadimulam@gmail.com',
      to: email, 
      subject: 'Your OTP for Password Reset',
      text: `Your OTP for resetting the password is: ${otp}. This OTP is valid for 5 minutes.`,
    };

    mailTransporter.sendMail(mailDetails, (err, data) => {
      if (err) {
        console.error('Error while sending email:', err);
        return res.status(500).json({ message: 'Failed to send email' });
      } else {
        console.log('Email sent successfully');
      }
    });

    return res.status(200).json({
      message: 'OTP sent to your email successfully',
      forgotpasswordtoken, 
    });
  } catch (error) {
    console.error('Error in forgotpassword:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


exports.verificationOtp = async (req, res) => {
  // const { token } = req.params;
  const { otp , forgotpasswordtoken} = req.body;

  try {
    const decoded = jwt.verify(forgotpasswordtoken, process.env.JWT_SECRET );

    const user = await User.findOne({ email: decoded.email.toLowerCase(), userotp: otp });

    if (!user) {
      return res.status(400).json({ message: 'Invalid token or OTP' });
    }

    const otpToken = jwt.sign(
      { email: user.email.toLowerCase() },
      process.env.JWT_SECRET ,
      { expiresIn: '10m' } 
    );


    user.userotp = null;
    // user.verifytoken = null; 
    // user.otpToken = otpToken; 
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully', otpToken });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please request a new OTP.' });
    }
    console.error('Error in verificationOtp:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetpassword = async (req, res) => {

  const { newPassword , otpToken } = req.body; 

  if (!newPassword) {
    return res.status(400).json({ message: 'New password is required' });
  }

  try {
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

    const user = await User.findOne({ email: decoded.email.toLowerCase(), otpToken });

    if (!user) {
      return res.status(404).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    // user.otpToken = null; 
    user.userotp = null;

    await user.save(); 

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please request a new OTP.' });
    }

    console.error('Error in resetpassword:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
