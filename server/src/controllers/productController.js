const inventoryService = require('../services/productService');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await inventoryService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getProductByID = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await inventoryService.getProductByID(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.addProduct = async (req, res) => {
    try {
        const { warehouse_id, 
            product_name,
            category_id,
            product_quantity,
            product_price,
            reorder_level,
            product_status,
            remarks
        } = req.body;
        const product = await inventoryService.addProduct(warehouse_id, 
            product_name, 
            category_id, 
            product_quantity, 
            product_price, 
            reorder_level, 
            product_status, 
            remarks
        );
        res.status(200).json(product);
        } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { warehouse_id, 
            product_name,
            category_id,
            product_price,
            reorder_level,
            product_status,
            remarks
        } = req.body;
        const product = await inventoryService.updateProduct(id, warehouse_id, 
            product_name, 
            category_id, 
            product_price, 
            reorder_level, 
            product_status, 
            remarks
        );
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await inventoryService.deleteProduct(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getProductByWarehouse = async (req, res) => {
    try {
        const { warehouse_id } = req.params;
        const products = await inventoryService.getProductByWarehouse(warehouse_id);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
