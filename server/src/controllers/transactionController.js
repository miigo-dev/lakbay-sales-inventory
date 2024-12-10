const transactionService = require('../services/transactionService');

exports.getCompletedOrders = async (req, res) => {
    try {
        const orders = await transactionService.getCompletedOrders();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching completed orders:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getOrderDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const orderDetails = await transactionService.getOrderDetailsById(id);
        res.status(200).json(orderDetails);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(404).json({ message: error.message });
    }
};

exports.getCompletedOrdersWithItems = async (req, res) => {
    try {
        const orders = await transactionService.getCompletedOrdersWithItems();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching completed orders with items:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}