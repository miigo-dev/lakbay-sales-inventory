const salesService = require('../services/salesService');

exports.getSalesData = async (req, res) => {
    try {
        const { period } = req.query; 
        if (!['daily', 'weekly', 'monthly', 'yearly'].includes(period)) {
            return res.status(400).json({ message: 'Invalid period specified' });
        }

        const data = await salesService.getSalesData(period);
        res.status(200).json({ data });
    } catch (error) {
        console.error('Error fetching sales data:', error);
        res.status(500).json({ message: 'Error fetching sales data', error: error.message });
    }
};

exports.getTopSalesItems = async (req, res) => {
    try {
        const { period, type } = req.query; 
        if (!['daily', 'weekly', 'monthly', 'yearly'].includes(period)) {
            return res.status(400).json({ message: 'Invalid period specified' });
        }

        const items = await salesService.getTopSalesItems(periods);
        res.status(200).json({ items });
    } catch (error) {
        console.error('Error fetching top sales items:', error);
        res.status(500).json({ message: 'Error fetching top sales items', error: error.message });
    }
};
