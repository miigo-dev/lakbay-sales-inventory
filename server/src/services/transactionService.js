const db = require('../db');

exports.getCompletedOrders = async () => {
    const { rows } = await db.query(`
        SELECT 
            order_id, 
            order_status, 
            TO_CHAR(order_date, 'YYYY-MM-DD') AS order_date -- Format date as YYYY-MM-DD
        FROM orders
        WHERE order_status = 'Completed'
        ORDER BY order_date DESC;
    `);
    return rows; // Each row represents one completed order
};

exports.getOrderDetailsById = async (orderId) => {
    const { rows } = await db.query(`
        SELECT 
            o.order_id, 
            o.order_status, 
            TO_CHAR(o.order_date, 'YYYY-MM-DD') AS order_date,
            oi.product_id, 
            p.product_name, 
            oi.quantity, 
            oi.order_total
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN products p ON oi.product_id = p.product_id
        WHERE o.order_id = $1
        ORDER BY oi.product_id;
    `, [orderId]);

    if (rows.length === 0) {
        throw new Error('Order not found.');
    }

    return {
        order_id: rows[0].order_id,
        order_status: rows[0].order_status,
        order_date: rows[0].order_date,
        items: rows.map(row => ({
            product_id: row.product_id,
            product_name: row.product_name,
            quantity: row.quantity,
            order_total: row.order_total,
        })),
    };
};

