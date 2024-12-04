const movementService = require('../services/movementService');

exports.createMovement = async (req, res) => {
    try {
        const { itemId, quantity, movementType, remarks, itemType } = req.body;
        const result = await movementService.createMovement(itemId, quantity, movementType, remarks, itemType);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMovementsByID = async (req, res) => {
    try {
        const { itemType, itemId } = req.params;

        // Convert itemType to uppercase for the database query
        const upperCaseItemType = itemType.toUpperCase();

        const movements = await movementService.getMovementsByID(itemId, upperCaseItemType);
        res.status(200).json(movements);
    } catch (error) {
        console.error('Error fetching movements by ID:', error);
        res.status(500).json({ error: error.message });
    }
};