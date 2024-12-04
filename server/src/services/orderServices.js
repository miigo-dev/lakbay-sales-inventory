const db = require('../db');

exports.createOrder = async function(order) {
    const { order_status, order_date, order_items } = order;
    try {
        await db.query('BEGIN');
        const orderResult = await db.query(
            'INSERT INTO orders (order_status, order_date) VALUES ($1, $2) RETURNING order_id',
            [order_status, order_date]
        );
        const orderId = orderResult.rows[0].order_id;

        for (const item of order_items) {
            const { product_id, quantity, order_total } = item;
            await db.query(
                'INSERT INTO order_items (order_id, product_id, quantity, order_total) VALUES ($1, $2, $3, $4)',
                [orderId, product_id, quantity, order_total]
            );
        }

        await db.query('COMMIT');
        return orderId;
    } catch (error) {
        await db.query('ROLLBACK');
        throw error;
    }
}

exports.getPendingOrders = async () => {
    const { rows } = await db.query(`
        SELECT 
            o.order_id, 
            o.order_status, 
            o.order_date, 
            COALESCE(SUM(oi.order_total), 0) AS total_amount
        FROM orders o
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        WHERE o.order_status = 'Pending'
        GROUP BY o.order_id, o.order_status, o.order_date
        ORDER BY o.order_date ASC;
    `);
    return rows;
};

exports.getMaxOrderNumber = async () => {
    const { rows } = await db.query(`
        SELECT MAX(order_id) AS max_order_id FROM orders;
    `);
    return rows[0]?.max_order_id || 0;
};

exports.getOrderByID = async (id) => {
    if (!id || isNaN(parseInt(id, 10))) {
        throw new Error('Invalid input: ID must be a valid integer');
    }

    const { rows } = await db.query(`
        SELECT 
            o.order_id, 
            o.order_status, 
            o.order_date, 
            oi.order_item_id, 
            oi.product_id, 
            oi.quantity, 
            oi.order_total
        FROM orders o
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        WHERE o.order_id = $1
        ORDER BY oi.order_item_id;
    `, [parseInt(id, 10)]);

    return rows;
};

exports.deleteOrder = async function(orderId) {
    await db.query(
        'DELETE FROM orders WHERE order_id = $1',
        [orderId]
    );
}

exports.updateOrderStatus = async function(orderId, order_status) {
    try {
        await db.query(
            'UPDATE orders SET order_status = $1, updated_at = CURRENT_TIMESTAMP WHERE order_id = $2',
            [order_status, orderId]
        );
    } catch (error) {
        throw error;
    }
};

exports.completeOrder = async function (orderId) {
    try {
        await db.query('BEGIN');

        const { rows: orderItems } = await db.query(
            'SELECT product_id, quantity FROM order_items WHERE order_id = $1',
            [orderId]
        );

        if (orderItems.length === 0) {
            throw new Error('No items found for this order.');
        }

        for (const item of orderItems) {
            const { product_id, quantity } = item;
            await db.query(
                'UPDATE products SET product_quantity = product_quantity - $1 WHERE product_id = $2',
                [quantity, product_id]
            );
        }

        await db.query(
            'UPDATE orders SET order_status = $1, updated_at = CURRENT_TIMESTAMP WHERE order_id = $2',
            ['Completed', orderId]
        );

        await db.query('COMMIT');
        console.log('Order completed and stock updated successfully.');
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error completing order:', error);
        throw error;
    }
};