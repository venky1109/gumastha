const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  addProduct,
  getProductByBarcode,
  getProductByName,
  suggestProducts
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


router.get('/', verifyToken, getAllProducts);
router.post('/', verifyToken, authorizeRoles('ADMIN', 'INVENTORY'), addProduct);
router.get('/barcode/:barcode', verifyToken, getProductByBarcode);
router.get('/name/:name', verifyToken, getProductByName);
router.get('/suggest', verifyToken, suggestProducts);

module.exports = router;
