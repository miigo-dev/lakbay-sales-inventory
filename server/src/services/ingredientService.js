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
    type_id,
    ingredient_quantity,
    ingredient_unit,
    ingredient_price,
    supplier_id,
    reorder_level,
    ingredient_status
) => {
    const ingredient = await db.query('INSERT INTO ingredients (ingredient_name, type_id, ingredient_quantity, ingredient_unit, ingredient_price, supplier_id, reorder_level, ingredient_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [ingredient_name, type_id, ingredient_quantity, ingredient_unit, ingredient_price, supplier_id, reorder_level, ingredient_status]);
    return ingredient.rows[0];
}

exports.updateIngredient = async (
    ingredient_name,
    type_id,
    ingredient_quantity,
    ingredient_unit,
    ingredient_price,
    supplier_id,
    reorder_level,
    ingredient_status,
    id
) => {
    const ingredient = await db.query('UPDATE ingredients SET ingredient_name = $1, type_id = $2, ingredient_quantity = $3, ingredient_unit = $4, ingredient_price = $5, supplier_id = $6, reorder_level = $7, ingredient_status = $8 WHERE ingredient_id = $9 RETURNING *', [ingredient_name, type_id, ingredient_quantity, ingredient_unit, ingredient_price, supplier_id, reorder_level, ingredient_status, id]);
    return ingredient.rows[0];
}

exports.deleteIngredient = async (id) => {
    const ingredient = await db.query('DELETE FROM ingredients WHERE ingredient_id = $1 RETURNING *', [id]);
    return ingredient.rows[0];
}
