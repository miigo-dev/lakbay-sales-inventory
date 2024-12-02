const db = require('../db');

exports.getCompletedOrders = async () => {
    const { rows } = await db.query(`
        SELECT 
            order_id, 
            order_status, 
            TO_CHAR(order_date, 'YYYY-MM-DD') AS order_date,  -- Format date as 'YYYY-MM-DD'
            created_at,
            updated_at
        FROM orders 
        WHERE order_status = 'Completed';
    `);
    return rows;
}
