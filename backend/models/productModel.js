const db = require('../config/db');

console.log("📦 Loading product model...");

// Create products table with reference to catalogs
db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    catalogId INTEGER NOT NULL,
    barcodes TEXT NOT NULL,
    quantity INTEGER DEFAULT 0,
    MRP REAL,
    discount REAL,
    warranty TEXT,
    importedYear INTEGER,
    productDetails TEXT,
    couponCodes TEXT,
    promotionCodes TEXT,
    keywords TEXT,
    FOREIGN KEY (catalogId) REFERENCES catalogs(id)
  )
`, (err) => {
  if (err) {
    console.error("❌ Product table creation failed:", err.message);
  } else {
    console.log("✅ Products table created");
  }
});

const getAllProducts = (callback) => {
  const sql = `
    SELECT p.*, c.categoryName, c.subcategoryName, c.productName, c.quantity as catalogQuantity,c.brand as brand
    FROM products p
    JOIN catalogs c ON p.catalogId = c.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return callback(err);

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
    catalogId,
    barcodes,
    quantity,
    MRP,
    discount,
    warranty,
    importedYear,
    productDetails,
    couponCodes,
    promotionCodes,
    keywords
  } = data;

  // Check for barcode duplication first
  db.all(`SELECT * FROM products`, [], (err, rows) => {
    if (err) return callback(err);

    const existingBarcodes = rows.flatMap(row => JSON.parse(row.barcodes || '[]'));
    const duplicate = barcodes.find(b => existingBarcodes.includes(b));
    if (duplicate) return callback(new Error(`Barcode already exists: ${duplicate}`));

    const sql = `
      INSERT INTO products (
        catalogId, barcodes, quantity, MRP, discount,
        warranty, importedYear, productDetails,
        couponCodes, promotionCodes, keywords
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [
      catalogId,
      JSON.stringify(barcodes),
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
  });
};

const updateProduct = (id, data, callback) => {
  const {
    barcodes,
    quantity,
    MRP,
    discount,
    warranty,
    importedYear,
    productDetails,
    couponCodes,
    promotionCodes,
    keywords
  } = data;

  const sql = `
    UPDATE products SET
      barcodes = ?,
      quantity = ?,
      MRP = ?,
      discount = ?,
      warranty = ?,
      importedYear = ?,
      productDetails = ?,
      couponCodes = ?,
      promotionCodes = ?,
      keywords = ?
    WHERE id = ?
  `;

  db.run(sql, [
    JSON.stringify(barcodes),
    quantity,
    MRP,
    discount,
    warranty,
    importedYear,
    productDetails,
    JSON.stringify(couponCodes),
    JSON.stringify(promotionCodes),
    JSON.stringify(keywords),
    id
  ], function (err) {
    if (err) return callback(err);
    callback(null, { id, ...data });
  });
};

const deleteProduct = (id, callback) => {
  db.run(`DELETE FROM products WHERE id = ?`, [id], function (err) {
    if (err) return callback(err);
    callback(null, { message: "Product deleted", id });
  });
};

const getProductByBarcode = (barcode, callback) => {
  const sql = `
    SELECT p.*, c.productName FROM products p
    JOIN catalogs c ON p.catalogId = c.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return callback(err);
    const result = rows.find(row => {
      const barcodes = JSON.parse(row.barcodes || '[]');
      return barcodes.includes(barcode);
    });
    callback(null, result || null);
  });
};

const getProductByName = (name, callback) => {
  const sql = `
    SELECT p.*, c.productName FROM products p
    JOIN catalogs c ON p.catalogId = c.id
    WHERE LOWER(c.productName) = LOWER(?)
  `;
  db.get(sql, [name], (err, row) => {
    if (err) return callback(err);
    if (row) {
      row.barcodes = JSON.parse(row.barcodes || '[]');
      row.couponCodes = JSON.parse(row.couponCodes || '[]');
      row.promotionCodes = JSON.parse(row.promotionCodes || '[]');
      row.keywords = JSON.parse(row.keywords || '[]');
    }
    callback(null, row);
  });
};

const suggestProductsByCharacters = (input, callback) => {
  const query = `%${input.toLowerCase()}%`;
  const sql = `
    SELECT p.id, c.productName
    FROM products p
    JOIN catalogs c ON p.catalogId = c.id
    WHERE LOWER(c.productName) LIKE ?
    LIMIT 10
  `;
  db.all(sql, [query], callback);
};

const getProductsByCategory = (category, callback) => {
  const sql = `
    SELECT p.*, c.productName, c.categoryName
    FROM products p
    JOIN catalogs c ON p.catalogId = c.id
    WHERE LOWER(c.categoryName) = LOWER(?)
  `;
  db.all(sql, [category], callback);
};

const getProductsBySubcategory = (subcategory, callback) => {
  const sql = `
    SELECT p.*, c.productName, c.subcategoryName
    FROM products p
    JOIN catalogs c ON p.catalogId = c.id
    WHERE LOWER(c.subcategoryName) = LOWER(?)
  `;
  db.all(sql, [subcategory], callback);
};

const getProductsByBrand = (brand, callback) => {
  const sql = `
    SELECT p.*, c.productName, c.brand
    FROM products p
    JOIN catalogs c ON p.catalogId = c.id
    WHERE LOWER(c.brand) = LOWER(?)
  `;
  db.all(sql, [brand], callback);
};

module.exports = {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductByBarcode,
  getProductByName,
  suggestProductsByCharacters,
  getProductsByCategory,
  getProductsBySubcategory,
  getProductsByBrand
};
