const User = require('../models/User');
const bcrypt = require('bcrypt');const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET 

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
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
    console.log("login api run")
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign(
        { id: user._id, email: user.email, username: user.username },
        JWT_SECRET,
        { expiresIn: '30d' }
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
