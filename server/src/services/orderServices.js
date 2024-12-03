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

exports.getAllOrders = async () => {
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
        ORDER BY o.order_id, oi.order_item_id;
    `);

    const orders = rows.reduce((acc, row) => {
        const { order_id, order_status, order_date, order_item_id, product_id, quantity, order_total } = row;

        if (!acc[order_id]) {
            acc[order_id] = {
                order_id,
                order_status,
                order_date,
                items: []
            };
        }

        if (order_item_id) {
            acc[order_id].items.push({
                order_item_id,
                product_id,
                quantity,
                order_total
            });
        }

        return acc;
    }, {});

    return Object.values(orders);
};

exports.getOrderByID = async (id) => {
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
    `, [id]);

    if (rows.length === 0) {
        return null;
    }

    const { order_id, order_status, order_date } = rows[0];
    const items = rows
        .filter(row => row.order_item_id)
        .map(({ order_item_id, product_id, quantity, order_total }) => ({
            order_item_id,
            product_id,
            quantity,
            order_total
        }));

    return {
        order_id,
        order_status,
        order_date,
        items
    };
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
    console.log("Updating order ID in DB: ", orderId); // Log the order ID
    try {
        await db.query(
            'UPDATE orders SET order_status = $1, updated_at = CURRENT_TIMESTAMP WHERE order_id = $2',
            ['Completed', orderId]
        );
        console.log("Order updated successfully in the database."); // Log success
    } catch (error) {
        console.error("Database query error:", error); // Log query error
        throw error;
    }
};