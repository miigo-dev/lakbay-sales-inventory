const { check } = require('express-validator');

const addProduct = [
    check('product_name')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long'),
    check('product_price')
        .isNumeric()
        .withMessage('Price must be a number'),
    check('product_quantity')
        .isNumeric()
        .withMessage('Quantity must be a number'),
];


module.exports = {
    addProductValidation: [addProduct],
};
