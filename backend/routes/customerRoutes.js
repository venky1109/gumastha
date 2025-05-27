const express = require('express');
const router = express.Router();
const {
  createCustomer,
  getCustomerByPhone,
  getAllCustomers
} = require('../controllers/customerController');
const { verifyToken } = require('../middleware/authMiddleware');

// POST: Add new customer
router.post('/', verifyToken, createCustomer);

// GET: Search customer by phone
router.get('/phone/:phone', verifyToken, getCustomerByPhone);

// GET: Get all customers
router.get('/', verifyToken, getAllCustomers);

module.exports = router;
