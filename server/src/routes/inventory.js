const { Router } = require('express');
const { addProductValidation, 
    addIngredientValidation, 
    addIngredientTypeValidation,
    addSupplierValidation } = require('../validators/inventory');
const { addProduct, 
    addIngredient, 
    addIngredientType,
    addSupplier } = require('../controllers/inventory');
const { validationMiddleware } = require('../middlewares/validations-middleware');
const router = Router();

router.post('/inventory/add-product', addProductValidation, validationMiddleware, addProduct)
router.post('/inventory/add-ingredient', addIngredientValidation, validationMiddleware, addIngredient)
router.post('/inventory/add-ingredient-type', addIngredientTypeValidation, validationMiddleware, addIngredientType)
router.post('/inventory/add-supplier', addSupplierValidation, validationMiddleware, addSupplier)

module.exports = router;