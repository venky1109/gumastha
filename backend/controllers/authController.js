const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const register = async (req, res) => {
  const { username, password, role } = req.body;
  if (!['ADMIN', 'INVENTORY', 'CASHIER'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  User.createUser(username, hashedPassword, role, (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(user);
  });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  User.getUserByUsername(username, async (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ token, role: user.role });
  });
};

module.exports = { register, login };
