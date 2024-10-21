const db = require('../db');

exports.getAllProducts = async () => {
    const { rows } = await db.query('SELECT * FROM products');
    return rows;
}

exports.getProductByID = async (id) => {
    const { rows } = await db.query('SELECT * FROM products WHERE product_id = $1', [id]);
    return rows[0];
}

exports.addProduct = async (
    warehouse_id,
    product_name, 
    category_id, 
    product_quantity, 
    product_price, 
    reorder_level, 
    product_status, 
    remarks
) => {
    const { rows } = await db.query('INSERT INTO products (warehouse_id, product_name, category_id, product_quantity, product_price, reorder_level, product_status, remarks) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [warehouse_id, product_name, category_id, product_quantity, product_price, reorder_level, product_status, remarks]);
    return rows[0];  
}

exports.updateProduct = async () => {
    const { rows } = await db.query('UPDATE products SET warehouse_id = $1, product_name = $2, category_id = $3, product_price = $4, reorder_level = $5, product_status = $6, remarks = $7 WHERE product_id = $8 RETURNING *', [warehouse_id, product_name, category_id, product_price, reorder_level, product_status, remarks, id]);
    return rows[0];
}

exports.deleteProduct = async (id) => {
    const { rows } = await db.query('DELETE FROM products WHERE product_id = $1 RETURNING *', [id]);
    return rows[0];
}