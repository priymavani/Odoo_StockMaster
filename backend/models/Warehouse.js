// models/Warehouse.js

const mongoose = require('mongoose');

const WarehouseSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Warehouse code is required (e.g., WH-MUM)'],
        unique: true,
        trim: true,
        uppercase: true
    },
    name: {
        type: String,
        required: [true, 'Warehouse name is required'],
        trim: true
    },
    address: {
        type: String,
        default: 'Not specified'
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Warehouse', WarehouseSchema);