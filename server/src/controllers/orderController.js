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
    const { items, order_status } = req.body; 
    /*
      `items` should be an array of objects like:
      [
          { product_id: 1, quantity: 2, order_total: 40.00 },
          { product_id: 2, quantity: 1, order_total: 20.00 }
      ]
    */

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Items are required and must be a non-empty array.' });
    }

    try {
        const newOrder = await orderService.addOrder(items, order_status);
        res.status(201).json(newOrder);
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
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(deletedOrder);
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};