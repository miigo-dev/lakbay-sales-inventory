const { Router } = require('express');
const { addProductValidation } = require('../validators/inventory');
const { validationMiddleware } = require('../middlewares/validations-middleware');
const { addProduct } = require('../controllers/inventory');
const router = Router();

router.post('/inventory/add-product', addProductValidation, validationMiddleware, addProduct)

module.exports = router;