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

const addIngredient = [
    check('ingredient_name')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long'),
    check('ingredient_price')
        .isNumeric()
        .withMessage('Price must be a number'),
    check('ingredient_quantity')
        .isNumeric()
        .withMessage('Quantity must be a number'),
    check('ingredient_unit')
        .isLength({ min: 1 })
        .withMessage('Unit must be at least 1 character long'),
];

const addIngredientType = [
    check('type_name')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long'),
];

const addSupplier = [
    check('supplier_name')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long'),
    check('contact_person')
        .isLength({ min: 3 })
        .withMessage('Contact person must be at least 3 characters long'),
    check('phone_number')
        .isLength({ min: 10 })
        .withMessage('Phone number must be at least 10 characters long'),
    check('email')
        .isEmail()
        .withMessage('Email must be a valid email'),
    check('address')
        .isLength({ min: 3 })
        .withMessage('Address must be at least 3 characters long'),
];

module.exports = {
    addProductValidation: [addProduct],
    addIngredientValidation: [addIngredient],
    addIngredientTypeValidation: [addIngredientType],
    addSupplierValidation: [addSupplier],
};
