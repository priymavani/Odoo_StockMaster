// controllers/warehouseController.js

const Warehouse = require('../models/Warehouse');
const Location = require('../models/Location');
const mongoose = require('mongoose');

// --- Warehouse CRUD ---

// 1. GET all Warehouses (No Change)
exports.getWarehouses = async (req, res) => {
    try {
        const warehouses = await Warehouse.find({ is_active: true });
        res.status(200).json({ success: true, count: warehouses.length, data: warehouses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. POST create Warehouse (No Change)
exports.createWarehouse = async (req, res) => {
    try {
        const warehouse = await Warehouse.create(req.body);
        res.status(201).json({ success: true, data: warehouse });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Warehouse code already exists.' });
        }
        res.status(400).json({ success: false, message: error.message });
    }
};

// 3. PUT update Warehouse (FIXED to use CODE)
exports.updateWarehouse = async (req, res) => {
    try {
        // FIX: Find by 'code' (req.params.id) instead of default '_id' 
        const warehouse = await Warehouse.findOneAndUpdate(
            { code: req.params.id.toUpperCase() }, // CODE ko uppercase mein dhoondhega
            req.body, 
            { new: true, runValidators: true }
        );
        if (!warehouse) {
            return res.status(404).json({ success: false, message: 'Warehouse not found with this code.' });
        }
        res.status(200).json({ success: true, data: warehouse });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// 4. DELETE Warehouse (Soft Delete - FIXED to use CODE)
exports.deleteWarehouse = async (req, res) => {
    try {
        // FIX: Find by 'code' (req.params.id) instead of default '_id'
        const warehouse = await Warehouse.findOneAndUpdate(
            { code: req.params.id.toUpperCase() }, // CODE ko uppercase mein dhoondhega
            { is_active: false }, 
            { new: true }
        );
        if (!warehouse) {
            return res.status(404).json({ success: false, message: 'Warehouse not found with this code.' });
        }
        res.status(200).json({ success: true, message: 'Warehouse successfully archived.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Location CRUD and Relations (REST OF THE FUNCTIONS REMAIN THE SAME) ---

// 5. POST create Location (Still requires WAREHOUSE '_id')
exports.createLocation = async (req, res) => {
    try {
        // Verify if the Warehouse exists before creating location
        // NOTE: req.body.warehouse must be the MongoDB ObjectId (_id)
        const warehouseExists = await Warehouse.findById(req.body.warehouse);
        if (!warehouseExists) {
            return res.status(404).json({ success: false, message: 'Parent Warehouse not found.' });
        }

        const location = await Location.create(req.body);
        res.status(201).json({ success: true, data: location });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Location code already exists.' });
        }
        res.status(400).json({ success: false, message: error.message });
    }
};

// 6. GET Locations by Warehouse ID (Still requires WAREHOUSE '_id')
exports.getLocationsByWarehouse = async (req, res) => {
    try {
        // Since the route parameter is named 'warehouseId', we assume it's the ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.warehouseId)) {
            // Hum ab bhi yahan ObjectId expect kar rahe hain, isliye error dega agar invalid format hai.
            return res.status(400).json({ success: false, message: 'Invalid Warehouse ID format (Expected ObjectId).' });
        }

        const locations = await Location.find({ warehouse: req.params.warehouseId })
            .populate({
                path: 'warehouse',
                select: 'name code'
            });

        res.status(200).json({ success: true, count: locations.length, data: locations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 7. GET all Locations (No Change)
exports.getAllLocations = async (req, res) => {
    try {
        const locations = await Location.find().populate({ path: 'warehouse', select: 'name code' });
        res.status(200).json({ success: true, count: locations.length, data: locations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 8. PUT update Location (No Change - still uses Mongoose _id)
exports.updateLocation = async (req, res) => {
    try {
        const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!location) {
            return res.status(404).json({ success: false, message: 'Location not found.' });
        }
        res.status(200).json({ success: true, data: location });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};