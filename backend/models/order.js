const db = require('../config/db');
console.log("📁 Loading order models...");

db.run(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT NOT NULL,
    datetime TEXT NOT NULL,
    total_amount REAL NOT NULL,
    payment_method TEXT,
    user_id INTEGER
  )
`, (err) => {
  if (err) console.error("❌ Error creating orders table:", err.message);
  else console.log("✅ Orders table created or already exists.");
});

const Order = {
  create: (data, callback) => {
    const { order_number, datetime, total_amount, payment_method, user_id } = data;
    db.run(
      `INSERT INTO orders (order_number, datetime, total_amount, payment_method, user_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [order_number, datetime, total_amount, payment_method, user_id],
      function (err) {
        callback(err, { id: this.lastID });
      }
    );
  },

  findAll: (callback) => {
    db.all(`SELECT * FROM orders ORDER BY datetime DESC`, [], callback);
  },
  
findlatest10: (callback) => {
  db.all(
    `SELECT 
        orders.*, 
        customers.name AS customer_name, 
        customers.phone AS customer_phone, 
        customers.email AS customer_email, 
        customers.address AS customer_address 
     FROM orders 
     LEFT JOIN customers ON orders.user_id = customers.id 
     ORDER BY orders.datetime DESC 
     LIMIT 10`,
    [],
    callback
  );
},

  findById: (id, callback) => {
    db.get(`SELECT * FROM orders WHERE id = ?`, [id], callback);
  },

  delete: (id, callback) => {
    db.run(`DELETE FROM orders WHERE id = ?`, [id], callback);
  }
};

module.exports = Order;
