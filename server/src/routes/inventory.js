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
    ingredientOut,
    getProducts
    } = require('../controllers/inventory');
const router = Router();

router.post('/products', addProductValidation, validationMiddleware, addProduct)
router.post('/products', productInValidation, validationMiddleware, productIn)
router.post('/products', productOutValidation, validationMiddleware, productOut)
router.post('/products', addProductCategoryValidation, validationMiddleware, addProductCategory)

router.post('/ingredients', addIngredientValidation, validationMiddleware, addIngredient)
router.post('/ingredients', ingredientInValidation, validationMiddleware, ingredientIn)
router.post('/ingredients', ingredientOutValidation, validationMiddleware, ingredientOut)
router.post('/ingredients', addIngredientTypeValidation, validationMiddleware, addIngredientType)

router.post('/add-supplier', addSupplierValidation, validationMiddleware, addSupplier)

router.get('/get-products', getProducts)

module.exports = router;