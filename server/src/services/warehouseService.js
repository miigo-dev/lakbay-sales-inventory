const db = require('../db');

exports.getAllWarehouses = async () => {
    const { rows } = await db.query('SELECT * FROM lakbay_warehouse');
    return rows;
}

exports.getWarehouseByID = async (id) => {
    const { rows } = await db.query('SELECT * FROM lakbay_warehouse WHERE warehouse_id = $1', [id]);
    return rows[0];
}

exports.addWarehouse = async (name) => {
    const { rows } = await db.query('INSERT INTO lakbay_warehouse (warehouse_name) VALUES ($1) RETURNING *', [name]);
    return rows[0];
}

exports.updateWarehouse = async (id, name) => {
    const { rows } = await db.query('UPDATE lakbay_warehouse SET warehouse_name = $1 WHERE warehouse_id = $2 RETURNING *', [name, id]);
    return rows[0];
}

exports.deleteWarehouse = async (id) => {
    try {
        await db.query('BEGIN'); 
        await db.query('DELETE FROM lakbay_warehouse WHERE warehouse_id = $1', [id]);
        const { rows } = await db.query('SELECT MAX(warehouse_id) FROM lakbay_warehouse');
        const maxId = rows[0].max || 0;
        await db.query('SELECT setval(\'lakbay_warehouse_warehouse_id_seq\', $1)', [maxId]);
        await db.query('COMMIT');
    } catch (error) {
        await db.query('ROLLBACK');
        throw new Error('Error deleting warehouse: ' + error.message);
    }
};

module.exports = exports;