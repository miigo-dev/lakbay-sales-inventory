const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/productController');

router.get('/products', inventoryController.getAllProducts);
router.get('/products/:id', inventoryController.getProductByID);
router.post('/products', inventoryController.addProduct);
router.put('/products/:id', inventoryController.updateProduct);
router.delete('/products/:id', inventoryController.deleteProduct);

module.exports = router;