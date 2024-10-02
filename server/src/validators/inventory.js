// inventoryValidation.js

const { check, validationResult } = require('express-validator');

// Validate adding a new inventory item
const validateAddInventoryItem = [
    check('ProductName')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('ProductName is required and must be a non-empty string'),
    
    check('Category')
        .optional()
        .isString()
        .withMessage('Category must be a string'),
    
    check('UnitOfMeasure')
        .optional()
        .isString()
        .withMessage('UnitOfMeasure must be a string'),

    check('Price')
        .isFloat({ gt: 0 })
        .withMessage('Price must be a positive number'),

    check('StockQuantity')
        .isInt({ gt: 0 })
        .withMessage('StockQuantity must be a positive integer'),

    check('UpdatedBy')
        .optional()
        .isString()
        .notEmpty()
        .withMessage('UpdatedBy must be a non-empty string'),
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
