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
) => {
    const { rows } = await db.query('INSERT INTO products (warehouse_id, product_name, category_id, product_quantity, product_price, reorder_level) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [warehouse_id, product_name, category_id, product_quantity, product_price, reorder_level]);
    return rows[0];  
}

exports.updateProduct = async (id, product_name, product_price) => {
    const { rows } = await db.query('UPDATE products SET product_name = $1, product_price = $2 WHERE product_id = $3 RETURNING *', [product_name, product_price, id]);
    return rows[0];
}

exports.deleteProduct = async (id) => {
    try {
        await db.query('BEGIN'); // Start transaction

        // Delete the product and return the deleted row
        const { rows } = await db.query('DELETE FROM products WHERE product_id = $1 RETURNING *', [id]);
        if (!rows[0]) {
            throw new Error('Product not found');
        }

        // Find the maximum product_id to reset the sequence correctly
        const maxIdResult = await db.query('SELECT MAX(product_id) FROM products');
        const maxId = maxIdResult.rows[0].max || 0;

        // Update the sequence value for product_id
        await db.query('SELECT setval(\'products_product_id_seq\', $1)', [maxId]);

        await db.query('COMMIT'); // Commit transaction
        return rows[0];
    } catch (error) {
        await db.query('ROLLBACK'); // Rollback transaction in case of error
        throw new Error('Error deleting product: ' + error.message);
    }
};

exports.getProductByWarehouse = async (warehouse_id) => {
    const product = await db.query('SELECT * FROM products WHERE warehouse_id = $1', [warehouse_id]);
    return product.rows;
}