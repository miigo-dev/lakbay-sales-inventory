const express = require('express');
const transactionController = require('../controllers/transactionController');
const router = express.Router();

router.get('/transaction/:id', transactionController.getOrderDetails);
router.get('/transaction', transactionController.getCompletedOrdersWithItems);

module.exports = router;