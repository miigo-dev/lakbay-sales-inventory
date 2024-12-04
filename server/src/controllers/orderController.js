const orderService = require('../services/orderServices');

exports.getPendingOrders = async (req, res) => {
    try {
        const orders = await orderService.getPendingOrders();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getMaxOrderNumber = async (req, res) => {
    try {
        const maxOrderNumber = await orderService.getMaxOrderNumber();
        res.status(200).json({ maxOrderNumber });
    } catch (error) {
        console.error('Error fetching max order number:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getOrderByID = async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id, 10))) {
        return res.status(400).json({ message: 'Invalid order ID' });
    }

    try {
        const order = await orderService.getOrderByID(parseInt(id, 10));
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


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

exports.completeOrder = async (req, res) => {
    const { id } = req.params;

    try {
        await orderService.completeOrder(id);
        res.status(200).json({ message: 'Order marked as completed and stock updated successfully.' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
