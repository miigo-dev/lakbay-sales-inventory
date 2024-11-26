const db = require('../db');

// Get all orders with their items
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

    // Group items by order_id
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

// Get a single order with its items by ID
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

// Add a new order with multiple products
exports.addOrder = async (items, order_status = 'Pending') => {
    const client = await db.connect();

    try {
        await client.query('BEGIN');

        // Insert into orders table
        const { rows: orderRows } = await client.query(
            'INSERT INTO orders (order_status) VALUES ($1) RETURNING *',
            [order_status]
        );
        const order = orderRows[0];

        // Insert into order_items table
        const itemQueries = items.map(({ product_id, quantity, order_total }) => {
            return client.query(
                'INSERT INTO order_items (order_id, product_id, quantity, order_total) VALUES ($1, $2, $3, $4)',
                [order.order_id, product_id, quantity, order_total]
            );
        });
        await Promise.all(itemQueries);

        await client.query('COMMIT');
        return order;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

// Delete an order and its items
exports.deleteOrder = async (id) => {
    const client = await db.connect();

    try {
        await client.query('BEGIN');

        // Delete from order_items table
        await client.query('DELETE FROM order_items WHERE order_id = $1', [id]);

        // Delete from orders table
        const { rows } = await client.query('DELETE FROM orders WHERE order_id = $1 RETURNING *', [id]);

        await client.query('COMMIT');
        return rows[0];
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};