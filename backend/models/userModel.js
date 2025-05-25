const db = require('../config/db');

// Create users table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('ADMIN', 'INVENTORY', 'CASHIER'))
  )
`);

// ✅ Add this missing function:
const createUser = (username, hashedPassword, role, callback) => {
  const sql = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
  db.run(sql, [username, hashedPassword, role], function (err) {
    callback(err, { id: this.lastID, username, role });
  });
};

const getUserByUsername = (username, callback) => {
  db.get(`SELECT * FROM users WHERE username = ?`, [username], callback);
};

const getAllUsers = (callback) => {
  db.all(`SELECT id, username, role FROM users`, [], callback);
};

const updateUser = ({ id, role, password }, callback) => {
  if (password) {
    const sql = `UPDATE users SET password = ?, role = ? WHERE id = ?`;
    db.run(sql, [password, role, id], function (err) {
      callback(err, { changes: this.changes });
    });
  } else {
    const sql = `UPDATE users SET role = ? WHERE id = ?`;
    db.run(sql, [role, id], function (err) {
      callback(err, { changes: this.changes });
    });
  }
};

const deleteUser = (id, callback) => {
  db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
    callback(err, { changes: this.changes });
  });
};

// ✅ Export everything now (including createUser)
module.exports = {
  createUser,
  getUserByUsername,
  getAllUsers,
  updateUser,
  deleteUser
};
