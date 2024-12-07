// src/services/alertService.js
const db = require('../config/db'); // Adjust your DB connection

exports.getRecentMovements = async () => {
    const query = `
        SELECT m.movement_id, m.item_type, m.movement_type, 
               m.movement_quantity, m.movement_date, 
               CASE WHEN m.item_type = 'PRODUCT' THEN p.product_name ELSE i.ingredient_name END AS item_name
        FROM movements m
        LEFT JOIN products p ON m.item_type = 'PRODUCT' AND m.item_id = p.product_id
        LEFT JOIN ingredients i ON m.item_type = 'INGREDIENT' AND m.item_id = i.ingredient_id
        WHERE m.movement_date >= NOW() - INTERVAL '7 days'
        ORDER BY m.movement_date DESC;
    `;
    const { rows } = await db.query(query);
    return rows;
};

exports.getPriceChanges = async () => {
    const query = `
        SELECT p.product_id, p.product_name, p.product_price, p.updated_at
        FROM products p
        WHERE p.updated_at >= NOW() - INTERVAL '7 days'
        ORDER BY p.updated_at DESC;
    `;
    const { rows } = await db.query(query);
    return rows;
};
