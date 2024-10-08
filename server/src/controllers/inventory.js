const db = require('../db');

exports.addProduct = async (req, res) => {
    const { product_name,
        product_quantity,
        product_price, 
        supplier_id, 
        reorder_level
    } = req.body;

    try {
        await db.query(
            'INSERT INTO products (product_name, product_quantity, product_price, supplier_id, reorder_level) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [product_name, product_quantity, product_price, supplier_id, reorder_level]
        );
    }
    catch (error) {
        console.error(error.message);
    }
}