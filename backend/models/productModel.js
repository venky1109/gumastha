const db = require('../config/db');

console.log("📦 Loading product model...");

db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    barcodes TEXT NOT NULL,
    category TEXT,
    productName TEXT NOT NULL,
    modelNo TEXT,
    quantity INTEGER DEFAULT 0,
    MRP REAL,
    discount REAL,
    warranty TEXT,
    importedYear INTEGER,
    productDetails TEXT,
    couponCodes TEXT,
    promotionCodes TEXT,
    keywords TEXT
  )
`, (err) => {
  if (err) {
    console.error("❌ Error creating products table:", err.message);
  } else {
    console.log("✅ Products table created or already exists.");
  }
});

const getAllProducts = (callback) => {
  db.all(`SELECT * FROM products`, [], (err, rows) => {
    if (err) return callback(err);
    // Parse JSON arrays before returning
    const parsed = rows.map(row => ({
      ...row,
      barcodes: JSON.parse(row.barcodes || '[]'),
      couponCodes: JSON.parse(row.couponCodes || '[]'),
      promotionCodes: JSON.parse(row.promotionCodes || '[]'),
      keywords: JSON.parse(row.keywords || '[]')
    }));
    callback(null, parsed);
  });
};

const addProduct = (data, callback) => {
  const {
    barcodes, category, productName, modelNo, quantity,
    MRP, discount, warranty, importedYear, productDetails,
    couponCodes, promotionCodes, keywords
  } = data;

  const sql = `
    INSERT INTO products (
      barcodes, category, productName, modelNo, quantity,
      MRP, discount, warranty, importedYear, productDetails,
      couponCodes, promotionCodes, keywords
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [
    JSON.stringify(barcodes),
    category,
    productName,
    modelNo,
    quantity,
    MRP,
    discount,
    warranty,
    importedYear,
    productDetails,
    JSON.stringify(couponCodes),
    JSON.stringify(promotionCodes),
    JSON.stringify(keywords)
  ], function (err) {
    if (err) return callback(err);
    callback(null, { id: this.lastID, ...data });
  });
};
const getProductByBarcode = (barcode, callback) => {
  db.all(`SELECT * FROM products`, [], (err, rows) => {
    if (err) return callback(err);
    const result = rows.find(row => {
      const barcodes = JSON.parse(row.barcodes || '[]');
      return barcodes.includes(barcode);
    });
    callback(null, result || null);
  });
};

const getProductByName = (name, callback) => {
  db.get(
    `SELECT * FROM products WHERE LOWER(productName) = LOWER(?)`,
    [name],
    (err, row) => {
      if (err) return callback(err);
      // Parse fields before returning
      if (row) {
        row.barcodes = JSON.parse(row.barcodes || '[]');
        row.couponCodes = JSON.parse(row.couponCodes || '[]');
        row.promotionCodes = JSON.parse(row.promotionCodes || '[]');
        row.keywords = JSON.parse(row.keywords || '[]');
      }
      callback(null, row);
    }
  );
};

const suggestProductsByCharacters = (input, callback) => {
  const query = `%${input.toLowerCase()}%`;
  db.all(
    `SELECT id, productName FROM products WHERE LOWER(productName) LIKE ? LIMIT 10`,
    [query],
    callback
  );
};

module.exports = {
  getAllProducts,
  addProduct,
  getProductByBarcode,
  getProductByName,
  suggestProductsByCharacters
};


