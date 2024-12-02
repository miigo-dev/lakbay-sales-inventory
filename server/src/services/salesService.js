const db = require('../db'); 

exports.getSalesData = async (period, type) => {
    let dateGroup;
    let query;

    switch (period) {
        case 'daily':
            dateGroup = "DATE(o.order_date)";
            break;
        case 'weekly':
            dateGroup = "TO_CHAR(o.order_date, 'IYYY-IW')"; 
            break;
        case 'monthly':
            dateGroup = "TO_CHAR(o.order_date, 'YYYY-MM')";
            break;
        case 'yearly':
            dateGroup = "TO_CHAR(o.order_date, 'YYYY')";
            break;
        default:
            throw new Error('Invalid period specified');
    }

    const result = await db.query(query, [type]);
    return result.rows.map(row => ({
        labels: row.period,
        data: row.total_sales
    }));
};

exports.getTopSalesItems = async (period, type) => {
    let dateGroup;
    let query;

    switch (period) {
        case 'daily':
            dateGroup = "DATE(o.order_date)";
            break;
        case 'weekly':
            dateGroup = "TO_CHAR(o.order_date, 'IYYY-IW')"; 
            break;
        case 'monthly':
            dateGroup = "TO_CHAR(o.order_date, 'YYYY-MM')";
            break;
        case 'yearly':
            dateGroup = "TO_CHAR(o.order_date, 'YYYY')";
            break;
        default:
            throw new Error('Invalid period specified');
    }

    query = `
        SELECT 
            p.product_name AS name,
            SUM(oi.order_total) AS sales
        FROM 
            orders o
        JOIN 
            order_items oi ON o.order_id = oi.order_id
        JOIN 
            products p ON oi.product_id = p.product_id
        WHERE 
            o.order_status = 'Completed'
            AND o.order_type = $1 -- Assuming 'order_type' field exists to filter by 'kape' or 'kain'
        GROUP BY 
            p.product_name
        ORDER BY 
            sales DESC
        LIMIT 5; -- Adjust as needed to return top N items
    `;

    const result = await db.query(query, [type]);
    return result.rows.map(row => ({
        img: 'path/to/icon.svg', 
        name: row.name,
        sales: row.sales
    }));
};
