const { check, validationResult } = require('express-validator');

const isLength = (min) => check('name')
    .isLength({ min })
    .withMessage(`Must be at least ${min} characters long`);

const isNumeric = (fieldName) => check(fieldName)
    .isNumeric()
    .withMessage(`${fieldName.replace('_', ' ')} must be a number`);

const isIntGreaterThanOrEqual = (fieldName) => check(fieldName)
    .isInt({ gt: -1 })
    .withMessage(`${fieldName.replace('_', ' ')} must not be lower than zero`);

const isEmailValid = check('email')
    .isEmail()
    .withMessage('Email must be a valid email');

const addProduct = [
    check('product_name').isLength({ min: 3 }).withMessage('Product Name must be at least 3 characters long'),
    isNumeric('product_price'),
    isNumeric('product_quantity')
];

const addIngredient = [
    check('ingredient_name').isLength({ min: 3 }).withMessage('Ingredient Name must be at least 3 characters long'),
    isNumeric('ingredient_price'),
    isNumeric('ingredient_quantity'),
    check('ingredient_unit').isLength({ min: 1 }).withMessage('Unit must be at least 1 character long')
];

const addIngredientType = [
    check('type_name').isLength({ min: 3 }).withMessage('Ingredient Type must be at least 3 characters long')
];

const addProductCategory = [
    check('category_name').isLength({ min: 3 }).withMessage('Category Name must be at least 3 characters long')
];

const addSupplier = [
    check('supplier_name').isLength({ min: 3 }).withMessage('Supplier Name must be at least 3 characters long'),
    check('contact_person').isLength({ min: 3 }).withMessage('Contact person must be at least 3 characters long'),
    check('phone_number').isLength({ min: 10 }).withMessage('Phone number must be at least 10 characters long'),
    isEmailValid,
    check('address').isLength({ min: 3 }).withMessage('Address must be at least 3 characters long')
];

const productIn = [
    isNumeric('product_id'),
    isIntGreaterThanOrEqual('pmove_quantity')
];

const productOut = [
    isNumeric('product_id'),
    isIntGreaterThanOrEqual('pmove_quantity')
];

const ingredientIn = [
    isNumeric('ingredient_id'),
    isIntGreaterThanOrEqual('imove_quantity')
];

const ingredientOut = [
    isNumeric('ingredient_id'),
    isIntGreaterThanOrEqual('imove_quantity')
];

module.exports = {
    addProductValidation: [addProduct],
    addIngredientValidation: [addIngredient],
    addIngredientTypeValidation: [addIngredientType],
    addProductCategoryValidation: [addProductCategory],
    addSupplierValidation: [addSupplier],
    productInValidation: [productIn],
    ingredientInValidation: [ingredientIn],
    productOutValidation: [productOut],
    ingredientOutValidation: [ingredientOut]
};

