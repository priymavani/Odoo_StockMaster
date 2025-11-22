const Product = require('../models/Product');
const Movement = require('../models/Movement');

async function getDashboard() {
  const [totalProducts, products, recentMovements] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    Product.find({ isActive: true }).select('name sku totalQuantity reorderLevel'),
    Movement.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('product', 'name sku')
      .populate('fromLocation toLocation', 'name code')
      .populate('createdBy', 'name email'),
  ]);

  const totalStock = products.reduce((sum, p) => sum + (p.totalQuantity || 0), 0);
  const lowStockItems = products.filter((p) => typeof p.reorderLevel === 'number' && p.totalQuantity <= p.reorderLevel);

  return {
    totalProducts,
    totalStock,
    lowStockItems,
    recentMovements,
  };
}

module.exports = { getDashboard };
