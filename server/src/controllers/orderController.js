const orderService = require('../services/orderServices');

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
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Add a new order
exports.addOrder = async (req, res) => {
    const { order_status, order_date, order_items } = req.body;

    if (!Array.isArray(order_items) || order_items.length === 0) {
        return res.status(400).json({ message: 'Items are required and must be a non-empty array.' });
    }

    const order = {
        order_status,
        order_date: order_date || new Date(),
        order_items
    };

    try {
        const newOrderId = await orderService.createOrder(order);
        res.status(201).json({ order_id: newOrderId });
    } catch (error) {
        console.error('Error adding order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        await orderService.deleteOrder(id);
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update an order status
exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { order_status } = req.body;

    try {
        await orderService.updateOrderStatus(id, order_status);
        res.status(200).json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};