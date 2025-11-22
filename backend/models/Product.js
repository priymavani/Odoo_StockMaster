const mongoose = require('mongoose');

const productLocationSchema = new mongoose.Schema(
  {
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    qty: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    category: { type: String, trim: true },
    uom: { type: String, required: true, trim: true },
    reorderLevel: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    locations: { type: [productLocationSchema], default: [] },
    totalQuantity: { type: Number, default: 0 },
    version: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.methods.recalculateTotalQuantity = function recalculateTotalQuantity() {
  this.totalQuantity = this.locations.reduce((sum, loc) => sum + (loc.qty || 0), 0);
};

productSchema.pre('save', function handlePreSave(next) {
  this.recalculateTotalQuantity();
  next();
});

module.exports = mongoose.model('Product', productSchema);
