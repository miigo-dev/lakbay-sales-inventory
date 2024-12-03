const express = require('express');
const transactionController = require('../controllers/transactionController');
const router = express.Router();

router.get('/transaction', transactionController.getCompletedOrders);
router.get('/transaction/:id', transactionController.getOrderDetails);

module.exports = router;