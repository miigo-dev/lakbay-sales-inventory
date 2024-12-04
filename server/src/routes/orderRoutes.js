const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

router.get('/orders/:id', orderController.getOrderByID);
router.post('/orders', orderController.addOrder);
router.delete('/orders/:id', orderController.deleteOrder);
router.put('/orders/:id/complete', orderController.completeOrder);
router.get('/orders', orderController.getPendingOrders);
router.get('/orders/maxOrderNumber', orderController.getMaxOrderNumber);

module.exports = router;