const express = require('express');
const router = express.Router();

const supplierController = require('../controllers/supplierController');

router.get('/suppliers', supplierController.getAllSuppliers);
router.get('/suppliers/:id', supplierController.getSupplierByID);
router.post('/suppliers', supplierController.addSupplier);
router.put('/suppliers/:id', supplierController.updateSupplier);
router.delete('/suppliers/:id', supplierController.deleteSupplier);

module.exports = router;