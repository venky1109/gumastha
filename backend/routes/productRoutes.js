const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductByBarcode,
  getProductByName,
  suggestProductsByCharacters,
  getProductsByCategory,
  getProductsByBrand,
  getProductsBySubcategory
} = require('../controllers/productController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created
 */



// View all products
router.get('/', verifyToken, getAllProducts);

// Add new product
router.post('/', verifyToken, authorizeRoles('ADMIN', 'INVENTORY'), addProduct);

// Update product
router.put('/:id', verifyToken, authorizeRoles('ADMIN', 'INVENTORY'), updateProduct);

// Delete product
router.delete('/:id', verifyToken, authorizeRoles('ADMIN'), deleteProduct);

// Search by barcode
router.get('/barcode/:barcode', verifyToken, getProductByBarcode);

// Search by product name
router.get('/name/:name', verifyToken, getProductByName);

// Suggest by name characters
router.get('/suggest', verifyToken, suggestProductsByCharacters);

// Filter by category
router.get('/category/:category', verifyToken, getProductsByCategory);

// Filter by subcategory
router.get('/subcategory/:subcategory', verifyToken, getProductsBySubcategory);
router.get('/brand/:brand', verifyToken, getProductsByBrand);

module.exports = router;
