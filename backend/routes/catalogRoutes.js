const express = require('express');
const router = express.Router();
const { getCatalogs, createCatalog } = require('../controllers/catalogController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
/**
 * @swagger
 * tags:
 *   name: Catalogs
 *   description: API endpoints for managing product catalogs
 */

/**
 * @swagger
 * /api/catalogs:
 *   get:
 *     summary: Get all catalog entries
 *     tags: [Catalogs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of catalog entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   categoryName:
 *                     type: string
 *                   subcategoryName:
 *                     type: string
 *                   productName:
 *                     type: string
 *                   quantity:
 *                     type: string
 *                   description:
 *                     type: string
 */

/**
 * @swagger
 * /api/catalogs:
 *   post:
 *     summary: Create a new catalog entry
 *     tags: [Catalogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryName
 *               - productName
 *               - quantity
 *             properties:
 *               categoryName:
 *                 type: string
 *                 example: Electronics
 *               subcategoryName:
 *                 type: string
 *                 example: Headphones
 *               productName:
 *                 type: string
 *                 example: Wireless Bluetooth Headphones
 *               quantity:
 *                 type: string
 *                 example: 1 piece
 *               description:
 *                 type: string
 *                 example: Over-ear noise-cancelling headphones
 *     responses:
 *       201:
 *         description: Catalog entry created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

// GET all catalog entries (any logged-in user)
router.get('/', verifyToken, getCatalogs);

// POST a new catalog entry (admin only)
router.post('/', verifyToken, authorizeRoles('ADMIN'), createCatalog);

module.exports = router;
