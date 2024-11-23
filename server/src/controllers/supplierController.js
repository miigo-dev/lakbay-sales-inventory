const supplierService = require('../services/supplierService');

exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await supplierService.getAllSuppliers();
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getSupplierByID = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await supplierService.getSupplierByID(id);
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.addSupplier = async (req, res) => {
    try {
        const { name, address, city, country, email, phone, contact_person, contact_person_phone } = req.body;
        const supplier = await supplierService.addSupplier(name, address, city, country, email, phone, contact_person, contact_person_phone);
        res.status(201).json(supplier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, city, country, email, phone, contact_person, contact_person_phone } = req.body;
        const supplier = await supplierService.updateSupplier(id, name, address, city, country, email, phone, contact_person, contact_person_phone);
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        await supplierService.deleteSupplier(id);
        res.status(200).json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}