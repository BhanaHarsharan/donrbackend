const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    const { sa_id, full_name, email, phone, date_of_birth, password } = req.body;
    if (!sa_id || !full_name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const user = await User.create({ sa_id, full_name, email, phone, date_of_birth, password });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const { password_hash, ...userData } = user;
    res.json({ user: userData, token });
  } catch (err) {
    next(err);
  }
};