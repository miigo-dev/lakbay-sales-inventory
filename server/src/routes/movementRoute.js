const express = require('express');
const router = express.Router();
const movementController = require('../controllers/movementController');

router.post('/product-movements', movementController.createProductMovement); 
router.get('/product-movements/:productId', movementController.getProductMovementsByID);
router.get('/product-movements', movementController.getProductMovements);

router.post('/ingredient-movements', movementController.createIngredientMovement); 
router.get('/ingredient-movements/:ingredientId', movementController.getIngredientMovementsByID); 
router.get('/ingredient-movements', movementController.getIngredientMovements); 


module.exports = router;
