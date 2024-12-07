const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');

router.get('/ingredients', ingredientController.getAllIngredients);
router.get('/ingredients/:id', ingredientController.getIngredientByID);
router.post('/ingredients', ingredientController.addIngredient);
router.put('/ingredients/:id', ingredientController.updateIngredient);
router.delete('/ingredients/:id', ingredientController.deleteIngredient);
router.get('/ingredients/warehouses/:warehouse_id', ingredientController.getIngredientByWarehouse);
router.get('/ingredient-types', ingredientController.getAllIngredientTypes);

module.exports = router;