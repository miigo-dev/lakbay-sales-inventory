const db = require('../db');

exports.getCompletedOrders = async () => {
    const { rows } = await db.query(`
        SELECT * FROM orders WHERE order_status = 'Completed';
        `);
    return rows;
}