const mongoose = require('mongoose');

const movementSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['receipt', 'delivery', 'transfer', 'adjustment'],
      required: true,
    },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true, min: 0 },
    fromLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    toLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    referenceId: { type: String },
    status: {
      type: String,
      enum: ['Draft', 'Waiting', 'Ready', 'Done', 'Canceled'],
      default: 'Done',
    },
    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movement', movementSchema);
