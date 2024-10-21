const db = require('../db');

exports.createProductMovement = async (productId, quantity, movementType, remarks) => {
    const product = await db.query('SELECT product_quantity FROM products WHERE product_id = $1', [productId]);

    if (!product.rows.length) {
        throw new Error('Product not found');
    }

    if (movementType === 'OUT' && product.rows[0].product_quantity < quantity) {
        throw new Error('Insufficient stock for product');
    }

    const newQuantity = movementType === 'IN' 
        ? product.rows[0].product_quantity + quantity 
        : product.rows[0].product_quantity - quantity;

    await db.query(
        'UPDATE products SET product_quantity = $1 WHERE product_id = $2',
        [newQuantity, productId]
    );

    const { rows } = await db.query(
        'INSERT INTO product_movements (product_id, pmove_quantity, movement_type, remarks) VALUES ($1, $2, $3, $4) RETURNING *',
        [productId, quantity, movementType, remarks]
    );

    return rows[0];
};

exports.getProductMovementsByID = async (productId) => {
    const { rows } = await db.query('SELECT * FROM product_movements WHERE product_id = $1', [productId]);
    return rows;
};

exports.getProductMovements = async () => {
    const { rows } = await db.query('SELECT * FROM product_movements');
    return rows;  
};

exports.createIngredientMovement = async (ingredientId, quantity, movementType, remarks) => {
    const ingredient = await db.query('SELECT ingredient_quantity FROM ingredients WHERE ingredient_id = $1', [ingredientId]);

    if (!ingredient.rows.length) {
        throw new Error('Ingredient not found');
    }

    if (movementType === 'OUT' && ingredient.rows[0].ingredient_quantity < quantity) {
        throw new Error('Insufficient stock for ingredient');
    }

    const newQuantity = movementType === 'IN'
        ? ingredient.rows[0].ingredient_quantity + quantity
        : ingredient.rows[0].ingredient_quantity - quantity;

    await db.query(
        'UPDATE ingredients SET ingredient_quantity = $1 WHERE ingredient_id = $2',
        [newQuantity, ingredientId]
    );

    const { rows } = await db.query(
        'INSERT INTO ingredient_movements (ingredient_id, imove_quantity, movement_type, remarks) VALUES ($1, $2, $3, $4) RETURNING *',
        [ingredientId, quantity, movementType, remarks]
    );

    return rows[0];
};

exports.getIngredientMovementsByID = async (ingredientId) => {
    const { rows } = await db.query('SELECT * FROM ingredient_movements WHERE ingredient_id = $1', [ingredientId]);
    return rows; 
};

exports.getIngredientMovements = async () => {
    const { rows } = await db.query('SELECT * FROM ingredient_movements');
    return rows; 
};