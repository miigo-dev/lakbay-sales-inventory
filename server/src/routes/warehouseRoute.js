const express = require('express');
const router = express.Router();

const warehouseController = require('../controllers/warehouseController');

router.get('/warehouses', warehouseController.getAllWarehouses);
router.get('/warehouses/:id', warehouseController.getWarehouseById);
router.post('/warehouses', warehouseController.addWarehouse);
router.put('/warehouses/:id', warehouseController.updateWarehouse);

module.exports = router;