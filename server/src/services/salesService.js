const db = require('../db');

// Determine grouping for different timeframes
const getDateGrouping = (period) => {
    switch (period) {
        case 'daily':
            return "DATE(o.order_date)";
        case 'weekly':
            return "TO_CHAR(o.order_date, 'IYYY-IW')";
        case 'monthly':
            return "TO_CHAR(o.order_date, 'YYYY-MM')";
        case 'yearly':
            return "TO_CHAR(o.order_date, 'YYYY')";
        default:
            throw new Error('Invalid period specified');
    }
};

// Fetch sales data grouped by timeframe and warehouse
exports.getSalesData = async (period, warehouseId) => {
    const dateGroup = getDateGrouping(period);

    const query = `
        SELECT 
            ${dateGroup} AS period,
            SUM(oi.order_total) AS total_sales
        FROM 
            orders o
        JOIN 
            order_items oi ON o.order_id = oi.order_id
        JOIN 
            products p ON oi.product_id = p.product_id
        WHERE 
            o.order_status = 'Completed' AND p.warehouse_id = $1
        GROUP BY 
            ${dateGroup}
        ORDER BY 
            ${dateGroup} ASC;
    `;

    try {
        const result = await db.query(query, [warehouseId]);
        return result.rows;
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('Error executing database query');
    }
};
