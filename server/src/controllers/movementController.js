const movementService = require('../services/movementService');

exports.createProductMovement = async (req, res) => {
    try {
        const { productId, quantity, movementType, remarks } = req.body;
        const result = await movementService.createProductMovement(productId, quantity, movementType, remarks);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProductMovementsByID = async (req, res) => {
    try {
        const movements = await movementService.getProductMovementsByID(req.params.productId);
        res.status(200).json(movements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProductMovements = async (req, res) => {
    try {
        const movements = await movementService.getProductMovements();
        res.status(200).json(movements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createIngredientMovement = async (req, res) => {
    try {
        const { ingredientId, quantity, movementType, remarks } = req.body;
        const result = await movementService.createIngredientMovement(ingredientId, quantity, movementType, remarks);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getIngredientMovementsByID = async (req, res) => {
    try {
        const movements = await movementService.getIngredientMovementsByID(req.params.ingredientId);
        res.status(200).json(movements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getIngredientMovements = async (req, res) => {
    try {
        const movements = await movementService.getProductMovements();
        res.status(200).json(movements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
