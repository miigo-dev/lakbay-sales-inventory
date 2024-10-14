const db = require('../db');

exports.getAllWarehouses = async () => {
    const warehouses = await db.query('SELECT * FROM lakbay_warehouse');
    return warehouses.rows;
}

exports.getWarehouseByID = async (id) => {
    const warehouse = await db.query('SELECT * FROM lakbay_warehouse WHERE warehouse_id = $1', [id]);
    return warehouse.rows[0];
}

exports.addWarehouse = async (name) => {
    const warehouse = await db.query('INSERT INTO lakbay_warehouse (warehouse_name) VALUES ($1) RETURNING *', [name]);
    return warehouse.rows[0];
}

exports.updateWarehouse = async (id, name) => {
    const warehouse = await db.query('UPDATE lakbay_warehouse SET warehouse_name = $1 WHERE warehouse_id = $2 RETURNING *', [name, id]);
    return warehouse.rows[0];
}

module.exports = exports;