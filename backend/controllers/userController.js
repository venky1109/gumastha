const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const listUsers = (req, res) => {
  User.getAllUsers((err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(users);
  });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { role, password } = req.body;

  if (!['ADMIN', 'INVENTORY', 'CASHIER'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  User.updateUser({ id, role, password: hashedPassword }, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User updated', result });
  });
};

const deleteUser = (req, res) => {
  const { id } = req.params;

  User.deleteUser(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User deleted', result });
  });
};

module.exports = { listUsers, updateUser, deleteUser };
