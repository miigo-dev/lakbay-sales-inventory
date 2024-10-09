const { Router } = require('express');
const { validationMiddleware } = require('../middlewares/validations-middleware');
const { addProductValidation, 
    addIngredientValidation, 
    addIngredientTypeValidation,
    addProductCategoryValidation,
    addSupplierValidation,
    productInValidation,
    ingredientInValidation,
    productOutValidation,
    ingredientOutValidation } = require('../validators/inventory');
const { addProduct, 
    addIngredient, 
    addIngredientType,
    addProductCategory,
    addSupplier,
    productIn,
    ingredientIn,
    productOut,
    ingredientOut } = require('../controllers/inventory');
const router = Router();

router.post('/inventory/add-product', addProductValidation, validationMiddleware, addProduct)
router.post('/inventory/add-ingredient', addIngredientValidation, validationMiddleware, addIngredient)
router.post('/inventory/add-ingredient-type', addIngredientTypeValidation, validationMiddleware, addIngredientType)
router.post('/inventory/add-product-category', addProductCategoryValidation, validationMiddleware, addProductCategory)
router.post('/inventory/add-supplier', addSupplierValidation, validationMiddleware, addSupplier)
router.post('/inventory/product-in', productInValidation, validationMiddleware, productIn)
router.post('/inventory/ingredient-in', ingredientInValidation, validationMiddleware, ingredientIn)
router.post('/inventory/product-out', productOutValidation, validationMiddleware, productOut)
router.post('/inventory/ingredient-out', ingredientOutValidation, validationMiddleware, ingredientOut)

module.exports = router;