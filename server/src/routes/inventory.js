const {
    validateAddInventoryItem,
    validateUpdateInventoryItem,
    validate,
} = require('./validations/inventoryValidation');
const express = require('express');
const router = express.Router();
const inventoryController = require('./controllers/inventory');

// Get all inventory items
router.get('/', inventoryController.getInventory);

// Get a single inventory item by ID
router.get('/:id', inventoryController.getInventoryById);

// Add a new inventory item with validation
router.post('/', validateAddInventoryItem, validate, inventoryController.addInventoryItem);

// Update an existing inventory item with validation
router.put('/:id', validateUpdateInventoryItem, validate, inventoryController.updateInventoryItem);

// Delete an inventory item
router.delete('/:id', inventoryController.deleteInventoryItem);

module.exports = router;