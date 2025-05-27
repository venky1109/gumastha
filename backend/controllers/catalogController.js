const Catalog = require('../models/catalogModel');

// GET /api/catalogs
const getCatalogs = (req, res) => {
  Catalog.getAllCatalogs((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// POST /api/catalogs
const createCatalog = (req, res) => {
  const { categoryName, subcategoryName, productName, quantity, description,brand } = req.body;

  if (!categoryName || !productName || !quantity) {
    return res.status(400).json({ error: "categoryName, productName, and quantity are required" });
  }

  Catalog.addCatalog(
    { categoryName, subcategoryName, productName, quantity, description, brand },
    (err, newCatalog) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json(newCatalog);
    }
  );
};

module.exports = {
  getCatalogs,
  createCatalog
};
