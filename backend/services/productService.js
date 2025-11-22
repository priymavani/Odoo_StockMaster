const { parse } = require('csv-parse');
const Product = require('../models/Product');
const Location = require('../models/Location');
const { logAudit } = require('./auditService');
const { buildPagination } = require('../utils/pagination');

async function listProducts({ page = 1, size = 10, q }) {
  const { limit, skip, page: p, size: s } = buildPagination(page, size);

  const filter = { isActive: true };
  if (q) {
    const regex = new RegExp(q, 'i');
    filter.$or = [{ name: regex }, { sku: regex }, { category: regex }];
  }

  const [items, total] = await Promise.all([
    Product.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Product.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page: p,
      size: s,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

async function createProduct(data, userId) {
  const product = await Product.create(data);
  await logAudit({ userId, action: 'create', entity: 'Product', entityId: product._id, payload: data });
  return product;
}

async function getProductById(id) {
  const product = await Product.findById(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
}

async function updateProduct(id, data, userId) {
  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  await logAudit({ userId, action: 'update', entity: 'Product', entityId: product._id, payload: data });
  return product;
}

async function deleteProduct(id, userId) {
  const product = await Product.findById(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  product.isActive = false;
  await product.save();
  await logAudit({ userId, action: 'delete', entity: 'Product', entityId: product._id, payload: { isActive: false } });
}

function parseCsv(buffer) {
  return new Promise((resolve, reject) => {
    parse(
      buffer.toString('utf8'),
      {
        columns: true,
        trim: true,
        skip_empty_lines: true,
      },
      (err, records) => {
        if (err) return reject(err);
        return resolve(records);
      }
    );
  });
}

// CSV columns: name, sku, category, uom, reorderLevel, locationCode (optional), qty (optional)
async function importProductsFromCsv(buffer, userId) {
  const records = await parseCsv(buffer);
  const results = { created: 0, skippedExisting: 0 };

  for (const row of records) {
    const {
      name,
      sku,
      category,
      uom,
      reorderLevel,
      locationCode,
      qty,
    } = row;

    if (!name || !sku || !uom) {
      // Skip invalid rows
      // eslint-disable-next-line no-continue
      continue;
    }

    const existing = await Product.findOne({ sku });
    if (existing) {
      results.skippedExisting += 1;
      // Optionally update stock if location/qty provided
      if (locationCode && qty) {
        const location = await Location.findOne({ code: locationCode });
        if (location) {
          const numericQty = Number(qty) || 0;
          const locIndex = existing.locations.findIndex((l) => l.location.toString() === location._id.toString());
          if (locIndex >= 0) {
            existing.locations[locIndex].qty += numericQty;
          } else {
            existing.locations.push({ location: location._id, qty: numericQty });
          }
          existing.recalculateTotalQuantity();
          await existing.save();
          await logAudit({
            userId,
            action: 'update',
            entity: 'Product',
            entityId: existing._id,
            payload: { fromCsv: true },
          });
        }
      }
      // eslint-disable-next-line no-continue
      continue;
    }

    const productData = {
      name,
      sku,
      category,
      uom,
      reorderLevel: reorderLevel ? Number(reorderLevel) : 0,
      locations: [],
    };

    if (locationCode && qty) {
      const location = await Location.findOne({ code: locationCode });
      if (location) {
        productData.locations.push({ location: location._id, qty: Number(qty) || 0 });
      }
    }

    const product = await Product.create(productData);
    await logAudit({ userId, action: 'create', entity: 'Product', entityId: product._id, payload: { fromCsv: true } });
    results.created += 1;
  }

  return results;
}

module.exports = {
  listProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  importProductsFromCsv,
};
