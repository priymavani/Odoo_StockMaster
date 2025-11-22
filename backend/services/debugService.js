const Product = require('../models/Product');

async function getDebugState() {
  const products = await Product.find({}).populate('locations.location', 'name code');

  const perProduct = products.map((p) => ({
    id: p._id,
    name: p.name,
    sku: p.sku,
    totalQuantity: p.totalQuantity,
    locations: p.locations.map((l) => ({
      locationId: l.location?._id || l.location,
      locationCode: l.location?.code,
      locationName: l.location?.name,
      qty: l.qty,
    })),
  }));

  const perLocationMap = new Map();
  products.forEach((p) => {
    p.locations.forEach((l) => {
      const key = (l.location?._id || l.location).toString();
      const entry = perLocationMap.get(key) || {
        locationId: l.location?._id || l.location,
        locationCode: l.location?.code,
        locationName: l.location?.name,
        totalQty: 0,
        products: [],
      };
      entry.totalQty += l.qty;
      entry.products.push({ productId: p._id, name: p.name, sku: p.sku, qty: l.qty });
      perLocationMap.set(key, entry);
    });
  });

  const perLocation = Array.from(perLocationMap.values());

  return { perProduct, perLocation };
}

module.exports = { getDebugState };
