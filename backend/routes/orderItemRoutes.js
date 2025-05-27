const express = require('express');
const router = express.Router();
const orderItemController = require('../controllers/orderItemController');

router.post('/', orderItemController.create);
router.get('/:order_id', orderItemController.getByOrder);
router.delete('/:id', orderItemController.delete);

module.exports = router;
