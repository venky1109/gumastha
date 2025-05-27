const db = require('../config/db');
console.log("📁 Loading order items models...");
db.run(`
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    item TEXT NOT NULL,        -- Display name of the product (optional for quick access)
    stock INTEGER DEFAULT 0,   -- Current stock at the time of order (optional)
    quantity INTEGER NOT NULL, -- Ordered quantity
    price REAL NOT NULL,       -- Per unit price
    discount REAL DEFAULT 0,   -- Discount per unit
    subtotal REAL NOT NULL,    -- Final price after discount (quantity * (price - discount))
    FOREIGN KEY (order_id) REFERENCES orders(id)
  )
`, (err) => {
  if (err) console.error("❌ Error creating order_items table:", err.message);
  else console.log("✅ Updated order_items table created or already exists.");
});


const OrderItem = {
  create: (data, callback) => {
    const { order_id, product_id, item, stock, quantity, price, discount, subtotal } = data;
    db.run(
      `INSERT INTO order_items 
       (order_id, product_id, item, stock, quantity, price, discount, subtotal)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [order_id, product_id, item, stock, quantity, price, discount, subtotal],
      function (err) {
        callback(err, { id: this.lastID });
      }
    );
  },

  findByOrderId: (order_id, callback) => {
    db.all(`SELECT * FROM order_items WHERE order_id = ?`, [order_id], callback);
  },

  delete: (id, callback) => {
    db.run(`DELETE FROM order_items WHERE id = ?`, [id], callback);
  }
};


module.exports = OrderItem;
