const db = require('../db');

exports.getAllSuppliers = async () => {
    const { rows } = await db.query('SELECT * FROM suppliers');
    return rows;
}

exports.getSupplierByID = async (id = 0) => {
    const { rows } = await db.query('SELECT * FROM suppliers WHERE supplier_id = $1', [id]);
    return rows[0];
}

exports.addSupplier = async (name, email, phone_number, address) => {
    const { rows } = await db.query('INSERT INTO suppliers (supplier_name, email, phone_number, address) VALUES ($1, $2, $3, $4) RETURNING *', [name, email, phone_number, address]);
    return rows[0];
}

exports.updateSupplier = async (id, name, email, phone_number, address) => {
    const { rows } = await db.query('UPDATE suppliers SET supplier_name = $1, email = $2, phone_number = $3, address = $4 WHERE supplier_id = $5 RETURNING *', [name, email, phone_number, address, id]);
    return rows[0];
}

exports.deleteSupplier = async (id) => {
    try {
        await db.query('BEGIN'); // Start transaction

        // Delete the supplier and return the deleted row
        const { rows } = await db.query('DELETE FROM suppliers WHERE supplier_id = $1 RETURNING *', [id]);
        if (!rows[0]) {
            throw new Error('Supplier not found');
        }

        // Find the maximum supplier_id to reset the sequence correctly
        const maxIdResult = await db.query('SELECT MAX(supplier_id) FROM suppliers');
        const maxId = maxIdResult.rows[0].max || 0;

        // Update the sequence value for supplier_id
        await db.query('SELECT setval(\'suppliers_supplier_id_seq\', $1)', [maxId]);

        await db.query('COMMIT'); // Commit transaction
        return rows[0];
    } catch (error) {
        await db.query('ROLLBACK'); // Rollback transaction in case of error
        throw new Error('Error deleting supplier: ' + error.message);
    }
};