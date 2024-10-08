const db = require('../db');

exports.addProduct = async (req, res) => {
    const { 
        product_name, 
        product_quantity, 
        product_price, 
        reorder_level 
    } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO products (product_name, product_quantity, product_price, reorder_level) VALUES ($1, $2, $3, $4) RETURNING *',
            [product_name, product_quantity, product_price, reorder_level]
        );
        res.status(201).json({ message: 'Product added successfully', product: result.rows[0] });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.addIngredient = async (req, res) => {
    const { 
        ingredient_name, 
        type_id,
        ingredient_quantity, 
        ingredient_unit, 
        ingredient_price, 
        supplier_id, 
        reorder_level 
    } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO ingredients (ingredient_name, type_id, ingredient_quantity, ingredient_unit, ingredient_price, supplier_id, reorder_level) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [ingredient_name, type_id, ingredient_quantity, ingredient_unit, ingredient_price, supplier_id, reorder_level]
        );
        res.status(201).json({ message: 'Ingredient added successfully', ingredient: result.rows[0] });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
}

exports.addIngredientType = async (req, res) => {
    const { type_name } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO ingredient_type (type_name) VALUES ($1) RETURNING *',
            [type_name]
        );
        res.status(201).json({ message: 'Ingredient type added successfully', ingredient_type: result.rows[0] });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
}

exports.addSupplier = async (req, res) => {
    const { 
        supplier_name, 
        contact_person, 
        phone_number, 
        email, 
        address 
    } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO suppliers (supplier_name, contact_person, phone_number, email, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [supplier_name, contact_person, phone_number, email, address]
        );
        res.status(201).json({ message: 'Supplier added successfully', supplier: result.rows[0] });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
}

