const db = require('../config/db');

console.log("📋 Loading customer model...");

db.run(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    address TEXT
  )
`, (err) => {
  if (err) {
    console.error("❌ Customer table creation failed:", err.message);
  } else {
    console.log("✅ Customers table ready");
  }
});

const addCustomer = (data, callback) => {
  const { name, phone, email, address } = data;
  const sql = `
    INSERT INTO customers (name, phone, email, address)
    VALUES (?, ?, ?, ?)
  `;
  db.run(sql, [name, phone, email, address], function (err) {
    if (err) return callback(err);
    callback(null, { id: this.lastID, ...data });
  });
};

const getCustomerByPhone = (phone, callback) => {
  db.get(`SELECT * FROM customers WHERE phone = ?`, [phone], callback);
};

const getAllCustomers = (callback) => {
  db.all(`SELECT * FROM customers ORDER BY name ASC`, [], callback);
};

module.exports = {
  addCustomer,
  getCustomerByPhone,
  getAllCustomers,
};
