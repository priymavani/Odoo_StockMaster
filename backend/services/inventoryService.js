// const mongoose = require('mongoose');
// const Product = require('../models/Product');
// const Location = require('../models/Location');
// const Movement = require('../models/Movement');
// const { logAudit } = require('./auditService');

// async function ensureLocation(id) {
//   const loc = await Location.findById(id);
//   if (!loc) {
//     const err = new Error('Location not found');
//     err.statusCode = 400;
//     throw err;
//   }
//   return loc;
// }

// async function ensureProduct(id) {
//   const product = await Product.findById(id);
//   if (!product) {
//     const err = new Error('Product not found');
//     err.statusCode = 400;
//     throw err;
//   }
//   return product;
// }

// function adjustLocationQty(product, locationId, delta) {
//   const locIndex = product.locations.findIndex((l) => l.location.toString() === locationId.toString());
//   if (locIndex === -1) {
//     if (delta < 0) {
//       const err = new Error('Insufficient stock at location');
//       err.statusCode = 400;
//       throw err;
//     }
//     product.locations.push({ location: locationId, qty: delta });
//   } else {
//     const newQty = (product.locations[locIndex].qty || 0) + delta;
//     if (newQty < 0) {
//       const err = new Error('Insufficient stock at location');
//       err.statusCode = 400;
//       throw err;
//     }
//     product.locations[locIndex].qty = newQty;
//   }
//   product.recalculateTotalQuantity();
//   product.version += 1;
// }

// async function processLines({ type, lines, userId, referenceId, note }) {
//   const session = await mongoose.startSession();
//   const createdMovements = [];

//   try {
//     await session.withTransaction(async () => {
//       for (const line of lines) {
//         const { productId, qty, fromLocationId, toLocationId } = line;
//         const quantity = Number(qty);
//         if (!productId || !quantity || quantity <= 0) {
//           const err = new Error('Invalid movement line');
//           err.statusCode = 400;
//           throw err;
//         }

//         const product = await ensureProduct(productId).session(session);

//         let fromLocId = fromLocationId;
//         let toLocId = toLocationId;

//         if (type === 'receipt') {
//           if (!toLocId) {
//             const err = new Error('toLocationId is required for receipt');
//             err.statusCode = 400;
//             throw err;
//           }
//           await ensureLocation(toLocId).session(session);
//           adjustLocationQty(product, toLocId, quantity);
//         } else if (type === 'delivery') {
//           if (!fromLocId) {
//             const err = new Error('fromLocationId is required for delivery');
//             err.statusCode = 400;
//             throw err;
//           }
//           await ensureLocation(fromLocId).session(session);
//           adjustLocationQty(product, fromLocId, -quantity);
//         } else if (type === 'transfer') {
//           if (!fromLocId || !toLocId) {
//             const err = new Error('fromLocationId and toLocationId are required for transfer');
//             err.statusCode = 400;
//             throw err;
//           }
//           await ensureLocation(fromLocId).session(session);
//           await ensureLocation(toLocId).session(session);
//           adjustLocationQty(product, fromLocId, -quantity);
//           adjustLocationQty(product, toLocId, quantity);
//         } else if (type === 'adjustment') {
//           if (!toLocId) {
//             const err = new Error('toLocationId is required for adjustment');
//             err.statusCode = 400;
//             throw err;
//           }
//           await ensureLocation(toLocId).session(session);
//           // For adjustment, qty is the delta (can be positive or negative)
//           adjustLocationQty(product, toLocId, quantity);
//         }

//         await product.save({ session });

//         const movement = await Movement.create(
//           [
//             {
//               type,
//               product: product._id,
//               qty: quantity,
//               fromLocation: fromLocId,
//               toLocation: toLocId,
//               createdBy: userId,
//               referenceId,
//               note,
//               status: 'Done',
//             },
//           ],
//           { session }
//         );

//         createdMovements.push(movement[0]);

//         await logAudit(
//           {
//             userId,
//             action: 'movement',
//             entity: 'Movement',
//             entityId: movement[0]._id,
//             payload: { type, productId: product._id, qty: quantity, fromLocId, toLocId },
//           },
//           session
//         );
//       }
//     });

//     return createdMovements;
//   } finally {
//     await session.endSession();
//   }
// }

// async function createReceipt({ lines, userId, referenceId, note }) {
//   return processLines({ type: 'receipt', lines, userId, referenceId, note });
// }

// async function createDelivery({ lines, userId, referenceId, note }) {
//   return processLines({ type: 'delivery', lines, userId, referenceId, note });
// }

// async function createTransfer({ lines, userId, referenceId, note }) {
//   return processLines({ type: 'transfer', lines, userId, referenceId, note });
// }

// async function createAdjustment({ lines, userId, referenceId, note }) {
//   return processLines({ type: 'adjustment', lines, userId, referenceId, note });
// }

// async function listMovements({ limit = 20, type, productId, locationId, status }) {
//   const query = {};
//   if (type) query.type = type;
//   if (productId) query.product = productId;
//   if (status) query.status = status;
//   if (locationId) {
//     query.$or = [{ fromLocation: locationId }, { toLocation: locationId }];
//   }

//   const lim = Math.min(Number(limit) || 20, 100);

//   const movements = await Movement.find(query)
//     .sort({ createdAt: -1 })
//     .limit(lim)
//     .populate('product', 'name sku')
//     .populate('fromLocation toLocation', 'name code')
//     .populate('createdBy', 'name email');

//   return movements;
// }

// module.exports = {
//   createReceipt,
//   createDelivery,
//   createTransfer,
//   createAdjustment,
//   listMovements,
// };
// services/inventoryService.js
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Location = require('../models/Location');
const Movement = require('../models/Movement');
const { logAudit } = require('./auditService');

async function ensureLocation(id, session = null) {
  const q = Location.findById(id);
  if (session) q.session(session);
  const loc = await q.exec();
  if (!loc) {
    const err = new Error('Location not found');
    err.statusCode = 400;
    throw err;
  }
  return loc;
}

async function ensureProduct(id, session = null) {
  const q = Product.findById(id);
  if (session) q.session(session);
  const product = await q.exec();
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 400;
    throw err;
  }
  return product;
}

function adjustLocationQty(product, locationId, delta) {
  const locIndex = product.locations.findIndex((l) => l.location.toString() === locationId.toString());
  if (locIndex === -1) {
    if (delta < 0) {
      const err = new Error('Insufficient stock at location');
      err.statusCode = 400;
      throw err;
    }
    product.locations.push({ location: locationId, qty: delta });
  } else {
    const newQty = (product.locations[locIndex].qty || 0) + delta;
    if (newQty < 0) {
      const err = new Error('Insufficient stock at location');
      err.statusCode = 400;
      throw err;
    }
    product.locations[locIndex].qty = newQty;
  }
  // assumes product.recalculateTotalQuantity exists on the model
  if (typeof product.recalculateTotalQuantity === 'function') {
    product.recalculateTotalQuantity();
  } else {
    // fallback: compute totalQuantity from locations
    product.totalQuantity = (product.locations || []).reduce((s, l) => s + (l.qty || 0), 0);
  }
  product.version = (product.version || 0) + 1;
}

async function processLines({ type, lines, userId, referenceId, note }) {
  // quick validation
  if (!Array.isArray(lines) || lines.length === 0) {
    const err = new Error('No movement lines provided');
    err.statusCode = 400;
    throw err;
  }

  // Start session & transaction
  const session = await mongoose.startSession();
  const createdMovements = [];

  try {
    await session.withTransaction(async () => {
      for (const line of lines) {
        const { productId, qty, fromLocationId, toLocationId } = line;
        const quantity = Number(qty);

        // basic line validation
        if (!productId || Number.isNaN(quantity)) {
          const err = new Error('Invalid movement line: missing productId or invalid qty');
          err.statusCode = 400;
          throw err;
        }

        if (quantity === 0 && type !== 'adjustment') {
          const err = new Error('Quantity must be non-zero for this movement type');
          err.statusCode = 400;
          throw err;
        }

        // fetch product WITH session (no .session() on doc)
        const product = await ensureProduct(productId, session);

        let fromLocId = fromLocationId;
        let toLocId = toLocationId;

        if (type === 'receipt') {
          if (!toLocId) {
            const err = new Error('toLocationId is required for receipt');
            err.statusCode = 400;
            throw err;
          }
          await ensureLocation(toLocId, session);
          adjustLocationQty(product, toLocId, quantity);
        } else if (type === 'delivery') {
          if (!fromLocId) {
            const err = new Error('fromLocationId is required for delivery');
            err.statusCode = 400;
            throw err;
          }
          await ensureLocation(fromLocId, session);
          adjustLocationQty(product, fromLocId, -quantity);
        } else if (type === 'transfer') {
          if (!fromLocId || !toLocId) {
            const err = new Error('fromLocationId and toLocationId are required for transfer');
            err.statusCode = 400;
            throw err;
          }
          await ensureLocation(fromLocId, session);
          await ensureLocation(toLocId, session);
          adjustLocationQty(product, fromLocId, -quantity);
          adjustLocationQty(product, toLocId, quantity);
        } else if (type === 'adjustment') {
          if (!toLocId) {
            const err = new Error('toLocationId is required for adjustment');
            err.statusCode = 400;
            throw err;
          }
          await ensureLocation(toLocId, session);
          // qty may be negative for adjustments
          adjustLocationQty(product, toLocId, quantity);
        } else {
          const err = new Error(`Unknown movement type: ${type}`);
          err.statusCode = 400;
          throw err;
        }

        // Save product with session
        await product.save({ session });

        // Create movement doc in the same session
        const movementDocs = await Movement.create(
          [
            {
              type,
              product: product._id,
              qty: Number(quantity),
              fromLocation: fromLocId || null,
              toLocation: toLocId || null,
              createdBy: userId,
              referenceId: referenceId || null,
              note: note || '',
              status: 'Done',
              createdAt: new Date(),
            },
          ],
          { session }
        );

        createdMovements.push(movementDocs[0]);

        // Log audit in same session (logAudit should accept session)
        await logAudit(
          {
            userId,
            action: 'movement',
            entity: 'Movement',
            entityId: movementDocs[0]._id,
            payload: { type, productId: product._id, qty: Number(quantity), fromLocId, toLocId },
          },
          session
        );
      } // end for
    }); // end withTransaction

    return createdMovements;
  } catch (err) {
    // Re-throw so callers (seed script) can see the error
    throw err;
  } finally {
    await session.endSession();
  }
}

async function createReceipt({ lines, userId, referenceId, note }) {
  return processLines({ type: 'receipt', lines, userId, referenceId, note });
}

async function createDelivery({ lines, userId, referenceId, note }) {
  return processLines({ type: 'delivery', lines, userId, referenceId, note });
}

async function createTransfer({ lines, userId, referenceId, note }) {
  return processLines({ type: 'transfer', lines, userId, referenceId, note });
}

async function createAdjustment({ lines, userId, referenceId, note }) {
  return processLines({ type: 'adjustment', lines, userId, referenceId, note });
}

async function listMovements({ limit = 20, type, productId, locationId, status }) {
  const query = {};
  if (type) query.type = type;
  if (productId) query.product = productId;
  if (status) query.status = status;
  if (locationId) {
    query.$or = [{ fromLocation: locationId }, { toLocation: locationId }];
  }

  const lim = Math.min(Number(limit) || 20, 100);

  const movements = await Movement.find(query)
    .sort({ createdAt: -1 })
    .limit(lim)
    .populate('product', 'name sku')
    .populate('fromLocation toLocation', 'name code')
    .populate('createdBy', 'name email');

  return movements;
}

module.exports = {
  createReceipt,
  createDelivery,
  createTransfer,
  createAdjustment,
  listMovements,
};
