const db = require('../db');

exports.addProduct = async (req, res) => {
    const { 
        product_name, 
        product_quantity, 
        product_price, 
        reorder_level,
        category_id,
        warehouse_id
    } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO products (product_name, product_quantity, product_price, reorder_level, category_id, warehouse_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [product_name, product_quantity, product_price, reorder_level, category_id, warehouse_id]
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
        ingredient_product_quantity, 
        ingredient_unit, 
        ingredient_price, 
        supplier_id, 
        reorder_level 
    } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO ingredients (ingredient_name, type_id, ingredient_product_quantity, ingredient_unit, ingredient_price, supplier_id, reorder_level) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [ingredient_name, type_id, ingredient_product_quantity, ingredient_unit, ingredient_price, supplier_id, reorder_level]
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

exports.addProductCategory = async (req, res) => {
    const { category_name } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO product_category (category_name) VALUES ($1) RETURNING *',
            [category_name]
        );
        res.status(201).json({ message: 'Product category added successfully', product_category: result.rows[0] });
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

exports.productIn = async (req, res) => {
    const { product_id, pmove_quantity, remarks } = req.body; // Removed product_quantity
    try {
        await db.query(
            'UPDATE products SET product_quantity = product_quantity + $1, updated_at = CURRENT_TIMESTAMP WHERE product_id = $2',
            [pmove_quantity, product_id] // Use pmove_quantity here
        );
        await db.query(
            'INSERT INTO product_movements (product_id, pmove_quantity, movement_type, remarks) VALUES ($1, $2, $3, $4)',
            [product_id, pmove_quantity, 'IN', remarks]
        );
        res.status(200).json({ message: 'Product stock updated successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.productOut = async (req, res) => {
    const { product_id, pmove_quantity, remarks } = req.body; 
    try {
        const checkStock = await db.query(
            'SELECT product_quantity FROM products WHERE product_id = $1',
            [product_id]
        );
        if (checkStock.rows[0].product_quantity < pmove_quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }
        await db.query(
            'UPDATE products SET product_quantity = product_quantity - $1, updated_at = CURRENT_TIMESTAMP WHERE product_id = $2',
            [pmove_quantity, product_id] 
        );
        await db.query(
            'INSERT INTO product_movements (product_id, pmove_quantity, movement_type, remarks) VALUES ($1, $2, $3, $4)',
            [product_id, pmove_quantity, 'OUT', remarks]
        );
        res.status(200).json({ message: 'Product stock removed successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.ingredientIn = async (req, res) => {
    const { ingredient_id, imove_quantity, remarks } = req.body;
    try {
        await db.query(
            'UPDATE ingredients SET ingredient_quantity = ingredient_quantity + $1, updated_at = CURRENT_TIMESTAMP WHERE ingredient_id = $2',
            [imove_quantity, ingredient_id] 
        );
        await db.query(
            'INSERT INTO ingredient_movements (ingredient_id, imove_quantity, movement_type, remarks) VALUES ($1, $2, $3, $4)',
            [ingredient_id, imove_quantity, 'IN', remarks] 
        );
        res.status(200).json({ message: 'Ingredient stock updated successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.ingredientOut = async (req, res) => {
    const { ingredient_id, imove_quantity, remarks } = req.body;
    try {
        const checkStock = await db.query(
            'SELECT ingredient_quantity FROM ingredients WHERE ingredient_id = $1',
            [ingredient_id]
        );
        if (checkStock.rows[0].ingredient_product_quantity < imove_quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }
        await db.query(
            'UPDATE ingredients SET ingredient_quantity = ingredient_quantity - $1, updated_at = CURRENT_TIMESTAMP WHERE ingredient_id = $2',
            [imove_quantity, ingredient_id] 
        );
        await db.query(
            'INSERT INTO ingredient_movements (ingredient_id, imove_quantity, movement_type, remarks) VALUES ($1, $2, $3, $4)',
            [ingredient_id, imove_quantity, 'OUT', remarks] 
        );
        res.status(200).json({ message: 'Ingredient stock removed successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};