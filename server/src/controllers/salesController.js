const salesService = require('../services/salesService');

// Fetch sales data based on period
exports.getSalesData = async (req, res) => {
    try {
        const { period } = req.query;

        if (!['daily', 'weekly', 'monthly', 'yearly'].includes(period)) {
            return res.status(400).json({ message: 'Invalid period specified' });
        }

        const salesData = await salesService.getSalesData(period);
        res.status(200).json({
            labels: salesData.map((row) => row.period),
            data: salesData.map((row) => parseFloat(row.total_sales))
        });
    } catch (error) {
        console.error('Error fetching sales data:', error);
        res.status(500).json({ message: 'Error fetching sales data', error: error.message });
    }
};


// Fetch combined sales totals and best sellers
exports.getSalesOverview = async (req, res) => {
    try {
        const { period } = req.query;

        if (!['daily', 'weekly', 'monthly', 'yearly'].includes(period)) {
            return res.status(400).json({ message: 'Invalid period specified' });
        }

        const [salesData, topItems] = await Promise.all([
            salesService.getSalesData(period),
            salesService.getTopSalesItems(period)
        ]);

        res.status(200).json({
            salesTotals: {
                labels: salesData.map((row) => row.period),
                data: salesData.map((row) => parseFloat(row.total_sales))
            },
            bestSellers: topItems
        });
    } catch (error) {
        console.error('Error fetching sales overview:', error);
        res.status(500).json({ message: 'Error fetching sales overview', error: error.message });
    }
};
