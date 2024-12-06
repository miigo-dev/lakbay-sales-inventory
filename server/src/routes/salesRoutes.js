const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// Endpoint for fetching sales data by timeframe
router.get('/sales', salesController.getSalesData);

// Endpoint to fetch both sales totals and best sellers in a single call
router.get('/overview', salesController.getSalesOverview);

module.exports = router;
