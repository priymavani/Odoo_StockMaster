// models/Location.js

const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Location code is required (e.g., RACK-A1)'],
        unique: true,
        trim: true,
        uppercase: true
    },
    name: {
        type: String,
        required: [true, 'Location name is required'],
        trim: true
    },
    // Foreign Key reference to the Warehouse model
    warehouse: {
        type: mongoose.Schema.ObjectId,
        ref: 'Warehouse',
        required: [true, 'Location must belong to a Warehouse']
    },
    is_receiving: {
        type: Boolean,
        default: false,
        required: true
    },
    is_shipping: {
        type: Boolean,
        default: false,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Location', LocationSchema);