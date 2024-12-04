const db = require('../db');

exports.createMovement = async (itemId, quantity, movementType, remarks, itemType) => {
    const table = itemType === 'PRODUCT' ? 'products' : 'ingredients';
    const quantityField = itemType === 'PRODUCT' ? 'product_quantity' : 'ingredient_quantity';

    // Fetch current quantity
    const item = await db.query(`SELECT ${quantityField} FROM ${table} WHERE ${table.slice(0, -1)}_id = $1`, [itemId]);
    if (!item.rows.length) {
        throw new Error(`${itemType} not found`);
    }

    const currentQuantity = item.rows[0][quantityField];
    if (movementType === 'OUT' && currentQuantity < quantity) {
        throw new Error('Insufficient stock');
    }

    // Calculate new quantity
    const newQuantity = movementType === 'IN' ? currentQuantity + quantity : currentQuantity - quantity;

    // Update quantity in the respective table
    await db.query(
        `UPDATE ${table} SET ${quantityField} = $1 WHERE ${table.slice(0, -1)}_id = $2`,
        [newQuantity, itemId]
    );

    // Insert movement into the unified movements table
    const { rows } = await db.query(
        `INSERT INTO movements (item_type, item_id, movement_quantity, movement_type, remarks) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [itemType, itemId, quantity, movementType, remarks]
    );

    return rows[0];
};

exports.getMovementsByID = async (itemId, itemType) => {
    const query = `
        SELECT 
            supplier_id, 
            movement_quantity, 
            movement_type, 
            remarks, 
            movement_date 
        FROM movements 
        WHERE item_type = $1 AND item_id = $2
    `;

    const { rows } = await db.query(query, [itemType, itemId]);
    return rows;
};