const {
    validateAddInventoryItem,
    validateUpdateInventoryItem,
    validate,
} = require('../validators/inventory');
const { Router } = require('express');
const router = Router();
const inventoryController = require('../controllers/inventory');

// Get all inventory items
router.get('/get-inv', inventoryController.getInventory);

// Get a single inventory item by ID
router.get('/inventory/:id', inventoryController.getInventoryById);

// Add a new inventory item with validation
router.post('/add-inv', validateAddInventoryItem, validate, inventoryController.addInventoryItem);

// Update an existing inventory item with validation
router.put('/inventory/:id', validateUpdateInventoryItem, validate, inventoryController.updateInventoryItem); // Updated path to include '/inventory'

// Delete an inventory item
router.delete('/inventory/:id', inventoryController.deleteInventoryItem);

module.exports = router;