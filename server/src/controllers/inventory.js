// inventory.js
const pool = require('../db'); // Ensure this is a connection pool

// Add a new product item
exports.addInventoryItem = async (req, res) => {
    const { ProductName, Category, UnitOfMeasure, Price, StockQuantity, SupplierID, UpdatedBy } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO products (ProductName, Category, UnitOfMeasure, Price, StockQuantity) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [ProductName, Category, UnitOfMeasure, Price, StockQuantity]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating inventory item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getInventory = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Products');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getInventoryById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query('SELECT * FROM Products WHERE ProductID = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(`Error fetching inventory item with ID ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateInventoryItem = async (req, res) => {
    const id = parseInt(req.params.id);
    const { ProductName, Category, UnitOfMeasure, Price, StockQuantity, SupplierID, UpdatedBy } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Products SET ProductName = $1, Category = $2, UnitOfMeasure = $3, Price = $4, StockQuantity = $5, SupplierID = $6, LastUpdated = CURRENT_TIMESTAMP, UpdatedBy = $7 WHERE ProductID = $8 RETURNING *',
            [ProductName, Category, UnitOfMeasure, Price, StockQuantity, SupplierID, UpdatedBy, id]
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

exports.deleteInventoryItem = async (req, res) => {
    const id = parseInt(req.params.id); // Parse the ID from the request parameters
    try {
        const result = await pool.query('DELETE FROM Products WHERE ProductID = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error(`Error deleting inventory item with ID ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};