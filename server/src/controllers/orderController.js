const orderService = require('../services/orderService');

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get an order by ID
exports.getOrderByID = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await orderService.getOrderByID(id);
        if (!order) {
            return res.status(200).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Add a new order
exports.addOrder = async (req, res) => {
    const { product_id, order_quantity, order_status } = req.body;
    try {
        const newOrder = await orderService.addOrder(product_id, order_quantity, order_status);
        res.status(200).json(newOrder);
    } catch (error) {
        console.error('Error adding order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedOrder = await orderService.deleteOrder(id);
        if (!deletedOrder) {
            return res.status(200).json({ message: 'Order not found' });
        }
        res.status(200).json(deletedOrder);
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
