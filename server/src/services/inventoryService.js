const db = require('../db');

exports.getAllProducts = async () => {
    const { rows } = await db.query('SELECT * FROM products');
    return rows;
}

exports.getProductByID = async (id) => {
    const { rows } = await db.query('SELECT * FROM products WHERE product_id = $1', [id]);
    return rows[0];
}