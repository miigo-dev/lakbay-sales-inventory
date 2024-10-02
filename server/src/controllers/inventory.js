// inventory.js

const pool = require('../db'); // Ensure this is a connection pool

// Get all inventory items
exports.getInventory = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Inventory');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get a single inventory item by ID
exports.getInventoryById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query('SELECT * FROM Inventory WHERE InventoryID = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(`Error fetching inventory item with ID ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Create a new inventory item
exports.addInventoryItem = async (req, res) => {
    const { ProductID, Quantity, UpdatedBy } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Inventory (ProductID, Quantity, UpdatedBy) VALUES ($1, $2, $3) RETURNING *',
            [ProductID, Quantity, UpdatedBy]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating inventory item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update an existing inventory item
exports.updateInventoryItem = async (req, res) => {
    const id = parseInt(req.params.id);
    const { Quantity, UpdatedBy } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Inventory SET Quantity = $1, LastUpdated = CURRENT_TIMESTAMP, UpdatedBy = $2 WHERE InventoryID = $3 RETURNING *',
            [Quantity, UpdatedBy, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(`Error updating inventory item with ID ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete an inventory item
exports.deleteInventoryItem = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query('DELETE FROM Inventory WHERE InventoryID = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error(`Error deleting inventory item with ID ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
