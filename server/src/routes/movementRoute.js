const express = require('express');
const router = express.Router();
const movementController = require('../controllers/movementController');

// Unified routes
router.post('/movements', movementController.createMovement);
router.get('/movements/:itemType/:itemId', movementController.getMovementsByID);

module.exports = router;
