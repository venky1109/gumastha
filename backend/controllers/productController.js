const Product = require('../models/productModel');

const getAllProducts = (req, res) => {
  Product.getAllProducts((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

const addProduct = (req, res) => {
  Product.addProduct(req.body, (err, newProduct) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(newProduct);
  });
};

const getProductByBarcode = (req, res) => {
  const { barcode } = req.params;
  Product.getProductByBarcode(barcode, (err, product) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });
};

const getProductByName = (req, res) => {
  const { name } = req.params;
  Product.getProductByName(name, (err, product) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });
};

const suggestProducts = (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Query parameter `q` is required' });

  Product.suggestProductsByCharacters(q, (err, suggestions) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(suggestions);
  });
};

module.exports = {
  getAllProducts,
  addProduct,
  getProductByBarcode,
  getProductByName,
  suggestProducts
};
