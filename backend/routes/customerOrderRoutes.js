const express = require('express');
const router = express.Router();
const customerOrderController = require('../controllers/customerOrderController');

router.post('/', customerOrderController.create);
router.get('/:customer_id', customerOrderController.getByCustomer);
router.delete('/:id', customerOrderController.delete);

module.exports = router;
