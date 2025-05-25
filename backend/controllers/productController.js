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

const suggestProductsByCharacters = (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Query parameter `q` is required' });

  Product.suggestProductsByCharacters(q, (err, suggestions) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(suggestions);
  });
};

const getProductsByCategory = (req, res) => {
  const { category } = req.params;
  Product.getProductsByCategory(category, (err, products) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(products);
  });
};

const getProductsBySubcategory = (req, res) => {
  const { subcategory } = req.params;
  Product.getProductsBySubcategory(subcategory, (err, products) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(products);
  });
};

const updateProduct = (req, res) => {
  const id = req.params.id;
  Product.updateProduct(id, req.body, (err, updated) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(updated);
  });
};

const deleteProduct = (req, res) => {
  const id = req.params.id;
  Product.deleteProduct(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

module.exports = {
  getAllProducts,
  addProduct,
  getProductByBarcode,
  getProductByName,
  suggestProductsByCharacters,
  getProductsByCategory,
  getProductsBySubcategory,
  updateProduct,
  deleteProduct
};
