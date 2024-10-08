const { check } = require('express-validator');

const addProductValidation = [
    check('name')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long'),
    check('price')
        .isNumeric()
        .withMessage('Price must be a number'),
    check('quantity')
        .isNumeric()
        .withMessage('Quantity must be a number'),
    check('description')
        .isLength({ min: 3 })
        .withMessage('Description must be at least 3 characters long'),
];


module.exports = {
    addProductValidation: [],
};
