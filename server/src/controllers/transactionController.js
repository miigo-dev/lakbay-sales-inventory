const transactionService = require('../services/transactionService');

exports.getCompletedOrders = async (req, res) => {
    try {
        const orders = await transactionService.getCompletedOrders();
        
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
