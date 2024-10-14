const warehouseService = require('../services/warehouseService');

exports.getAllWarehouses = async (req, res) => {
    try {
        const warehouses = await warehouseService.getAllWarehouses();
        res.status(200).json(warehouses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getWarehouseById = async (req, res) => {
    try {
        const { id } = req.params;
        const warehouse = await warehouseService.getWarehouseByID(id);
        res.status(200).json(warehouse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.addWarehouse = async (req, res) => {
    try {
        const { name } = req.body;
        const warehouse = await warehouseService.addWarehouse(name);
        res.status(201).json(warehouse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateWarehouse = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const warehouse = await warehouseService.updateWarehouse(id, name);
        res.status(200).json(warehouse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteWarehouse = async (req, res) => {
    try {
        const { id } = req.params;
        await warehouseService.deleteWarehouse(id);
        res.status(200).json({ message: 'Warehouse deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}