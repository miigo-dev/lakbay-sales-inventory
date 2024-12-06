const db = require('../db');

exports.getAllIngredients = async () => {
    const ingredients = await db.query('SELECT * FROM ingredients');
    return ingredients.rows;
}

exports.getIngredientByID = async (id) => {
    const ingredient = await db.query('SELECT * FROM ingredients WHERE ingredient_id = $1', [id]);
    return ingredient.rows[0];
}

exports.addIngredient = async (
    ingredient_name,
    ingredient_quantity,
    ingredient_unit,
    ingredient_price,
    supplier_id,
    reorder_level,
    type_id,    
    warehouse_id,
) => {
    const result = await db.query('INSERT INTO ingredients (ingredient_name, ingredient_quantity, ingredient_unit, ingredient_price, supplier_id, reorder_level, type_id, warehouse_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [ingredient_name, ingredient_quantity, ingredient_unit, ingredient_price, supplier_id, reorder_level, type_id, warehouse_id]);
    return result.rows[0];
}

exports.updateIngredient = async (id, ingredient_name, ingredient_price) => {
    const result = await db.query('UPDATE ingredients SET ingredient_name = $1, ingredient_price = $2 WHERE ingredient_id = $3 RETURNING *', [ingredient_name, ingredient_price, id]);
    return result.rows[0];
}

exports.deleteIngredient = async (id) => {
    const ingredient = await db.query('DELETE FROM ingredients WHERE ingredient_id = $1 RETURNING *', [id]);
    return ingredient.rows[0];
}

exports.getIngredientByWarehouse = async (warehouse_id) => {
    const ingredient = await db.query('SELECT * FROM ingredients WHERE warehouse_id = $1', [warehouse_id]);
    return ingredient.rows;
}

exports.addIngredientType = async (type_name) => {
    const result = await db.query('INSERT INTO ingredient_types (type_name) VALUES ($1) RETURNING *', [type_name]);
    return result.rows[0];
}