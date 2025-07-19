//const jwt = require('jsonwebtoken');
//const { User } = require('../models');
//const bcrypt = require('bcryptjs');
//
//const login = async (req, res) => {
//  const { username, password } = req.body;
//
//  try {
//    const user = await User.findOne({ where: { username } });
//
//    if (!user || !(await bcrypt.compare(password, user.password))) {
//      return res.status(401).json({ error: 'Invalid credentials' });
//    }
//
//    const token = jwt.sign(
//      { id: user.id, role: user.role },
//      process.env.JWT_SECRET,
//      { expiresIn: '8h' }
//    );
//
//    res.json({ token });
//  } catch (err) {
//    res.status(500).json({ error: 'Server error' });
//  }
//};
//
//const register = async (req, res) => {
//  const { username, password, role = 'staff' } = req.body;
//
//  try {
//    const existingUser = await User.findOne({ where: { username } });
//
//    if (existingUser) {
//      return res.status(400).json({ error: 'Username already exists' });
//    }
//
//    const user = await User.create({ username, password, role });
//    res.status(201).json({ id: user.id });
//  } catch (err) {
//    res.status(500).json({ error: 'Registration failed' });
//  }
//};
//
//module.exports = { login, register };

// controllers/authController.js

// backend/controllers/authController.js
exports.login = async (req, res) => {
  console.log('Fake login hit');

  // Set proper headers for credentials
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  res.status(200).json({
    token: 'dev-token',
    user: {
      id: 1,
      username: 'guest',
      email: 'guest@example.com',
      role: 'admin'
    }
  });
};


