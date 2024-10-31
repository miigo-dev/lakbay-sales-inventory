const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

router.get('/orders', orderController.getAllOrders);
router.get('/orders/:id', orderController.getOrderByID);
router.post('/orders', orderController.addOrder);
router.delete('/orders/:id', orderController.deleteOrder);

module.exports = router;
