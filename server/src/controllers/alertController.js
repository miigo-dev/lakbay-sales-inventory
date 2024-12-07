// src/controllers/alertController.js
const alertService = require('../services/alertService');

exports.getRecentMovements = async (req, res) => {
    try {
        const movements = await alertService.getRecentMovements();
        res.status(200).json(movements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPriceChanges = async (req, res) => {
    try {
        const priceChanges = await alertService.getPriceChanges();
        res.status(200).json(priceChanges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
