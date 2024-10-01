// inventoryValidation.js

const { check, validationResult } = require('express-validator');

// Validate adding a new inventory item
const validateAddInventoryItem = [
    check('ProductID').isInt().withMessage('ProductID must be an integer'),
    check('Quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
    check('UpdatedBy').isInt().withMessage('UpdatedBy must be an integer'),
];

// Validate updating an inventory item
const validateUpdateInventoryItem = [
    check('Quantity').optional().isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
    check('UpdatedBy').optional().isInt().withMessage('UpdatedBy must be an integer'),
];

// Middleware to check for validation errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateAddInventoryItem,
    validateUpdateInventoryItem,
    validate,
};
