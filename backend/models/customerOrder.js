const db = require('../config/db');

console.log("📁 Loading customer_order model...");

db.run(`
  CREATE TABLE IF NOT EXISTS customer_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    order_id INTEGER NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  )
`, (err) => {
  if (err) {
    console.error("❌ Error creating customer_orders table:", err.message);
  } else {
    console.log("✅ Customer_Orders table created or already exists.");
  }
});

const CustomerOrder = {
  create: (data, callback) => {
    const { customer_id, order_id } = data;
    db.run(
      `INSERT INTO customer_orders (customer_id, order_id) VALUES (?, ?)`,
      [customer_id, order_id],
      function (err) {
        callback(err, { id: this.lastID });
      }
    );
  },

  findByCustomerId: (customer_id, callback) => {
    db.all(`SELECT * FROM customer_orders WHERE customer_id = ?`, [customer_id], callback);
  },

  remove: (id, callback) => {
    db.run(`DELETE FROM customer_orders WHERE id = ?`, [id], callback);
  },
};

module.exports = CustomerOrder;
