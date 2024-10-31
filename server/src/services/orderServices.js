const db = require('../db');

// Get all orders
exports.getAllOrders = async () => {
    const { rows } = await db.query('SELECT * FROM orders');
    return rows;
}

// Get an order by ID
exports.getOrderByID = async (id) => {
    const { rows } = await db.query('SELECT * FROM orders WHERE order_id = $1', [id]);
    return rows[0];
}

// Add a new order-
exports.addOrder = async (
    product_id, 
    order_quantity, 
    order_status = 'Pending'
    ) => {
    const { rows } = await db.query(
        'INSERT INTO orders (product_id, order_quantity, order_status) VALUES ($1, $2, $3) RETURNING *',
        [product_id, order_quantity, order_status]
    );
    return rows[0];
}


// Delete an order
exports.deleteOrder = async (id) => {
    const { rows } = await db.query('DELETE FROM orders WHERE order_id = $1 RETURNING *', [id]);
    return rows[0];
}
