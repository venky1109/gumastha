const db = require('../config/db');

console.log("📁 Loading catalog model...");

db.run(`
  CREATE TABLE IF NOT EXISTS catalogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    categoryName TEXT NOT NULL,
    subcategoryName TEXT,
    productName TEXT,
    quantity TEXT,  -- e.g. '1kg', '500ml'
    description TEXT,
    brand TEXT
  )
`, (err) => {
  if (err) {
    console.error("❌ Error creating catalogs table:", err.message);
  } else {
    console.log("✅ Catalogs table created or already exists.");
  }
});

const getAllCatalogs = (callback) => {
  db.all(`SELECT * FROM catalogs`, [], callback);
};

const addCatalog = ({ categoryName, subcategoryName, productName, quantity, description, brand }, callback) => {
  const sql = `
    INSERT INTO catalogs (
      categoryName, subcategoryName, productName, quantity, description, brand
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.run(sql, [categoryName, subcategoryName, productName, quantity, description, brand], function (err) {
    callback(err, {
      id: this.lastID,
      categoryName,
      subcategoryName,
      productName,
      quantity,
      description,
      brand  
    });
  });
};

const getAllBrands = (callback) => {
  db.all(`SELECT DISTINCT brand FROM catalogs WHERE brand IS NOT NULL`, [], callback);
};

const getAllCategories = (callback) => {
  db.all(`SELECT DISTINCT categoryName FROM catalogs`, [], callback);
};


module.exports = {
  getAllCatalogs,
  addCatalog,
  getAllBrands,
  getAllCategories
};
