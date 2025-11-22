// models/Product.js

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    // SKU: Unique identifier, essential for inventory
    sku_code: {
        type: String,
        required: [true, 'SKU code is required'],
        unique: true,
        trim: true,
        uppercase: true
    },
    // Product Name
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    // Category (Inventory Manager defines this)
    category: {
        type: String,
        required: true,
        enum: ['Raw Material', 'Finished Goods', 'Packaging', 'Service'] // Example categories
    },
    // Unit of Measure (pcs, kg, box, etc.)
    unit_of_measure: {
        type: String,
        required: true
    },
    // Reordering Rule: Minimum stock level (IM's job)
    reorder_point: {
        type: Number,
        default: 0
    },
    // Current Stock (This will be updated by operations/Receipts/Deliveries)
    current_stock: {
        type: Number,
        default: 0,
        min: 0
    },
    // Soft Delete: Instead of permanent delete
    is_active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Product', ProductSchema);