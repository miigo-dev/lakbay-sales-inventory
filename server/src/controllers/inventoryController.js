const inventoryService = require('../services/inventoryService');

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