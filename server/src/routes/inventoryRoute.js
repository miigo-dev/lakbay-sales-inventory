const express = require('express');
const router = express.Router();

const inventoryController = require('../controllers/inventoryController');

router.get('/products', inventoryController.getAllProducts);
router.get('/products/:id', inventoryController.getProductByID);

module.exports = router;