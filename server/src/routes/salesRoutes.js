const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

router.get('/sales', salesController.getSalesData);

module.exports = router;
