// routes/warehouseRoutes.js

const express = require('express');
const {
    getWarehouses,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    createLocation,
    getLocationsByWarehouse,
    getAllLocations,
    updateLocation
} = require('../controllers/warehouseController');

const router = express.Router();

// --- Warehouse Routes ---
router.route('/warehouses')
    .get(getWarehouses)
    .post(createWarehouse);

router.route('/warehouses/:id')
    .put(updateWarehouse)
    .delete(deleteWarehouse);

// --- Location Routes ---
router.route('/locations')
    .get(getAllLocations) // Get all locations for transfer dropdowns
    .post(createLocation); // Create a new location

router.route('/locations/:id')
    .put(updateLocation);

// --- Relation Route ---
router.route('/warehouses/:warehouseId/locations')
    .get(getLocationsByWarehouse); // Get all locations under a specific warehouse

module.exports = router;