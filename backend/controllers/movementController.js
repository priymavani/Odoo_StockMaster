const { validationResult } = require('express-validator');
const {
  createReceipt,
  createDelivery,
  createTransfer,
  createAdjustment,
  listMovements,
} = require('../services/inventoryService');
const { success } = require('../utils/response');

async function handleListMovements(req, res, next) {
  try {
    const { limit, type, productId, locationId, status } = req.query;
    const movements = await listMovements({ limit, type, productId, locationId, status });
    return success(res, movements, 'Movements list');
  } catch (err) {
    return next(err);
  }
}

async function handleReceipt(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: true, message: 'Validation failed', details: errors.array() });
    }
    const { lines, referenceId, note } = req.body;
    const movements = await createReceipt({ lines, userId: req.auth.userId, referenceId, note });
    return success(res, movements, 'Receipt processed');
  } catch (err) {
    return next(err);
  }
}

async function handleDelivery(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: true, message: 'Validation failed', details: errors.array() });
    }
    const { lines, referenceId, note } = req.body;
    const movements = await createDelivery({ lines, userId: req.auth.userId, referenceId, note });
    return success(res, movements, 'Delivery processed');
  } catch (err) {
    return next(err);
  }
}

async function handleTransfer(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: true, message: 'Validation failed', details: errors.array() });
    }
    const { lines, referenceId, note } = req.body;
    const movements = await createTransfer({ lines, userId: req.auth.userId, referenceId, note });
    return success(res, movements, 'Transfer processed');
  } catch (err) {
    return next(err);
  }
}

async function handleAdjustment(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: true, message: 'Validation failed', details: errors.array() });
    }
    const { lines, referenceId, note } = req.body;
    const movements = await createAdjustment({ lines, userId: req.auth.userId, referenceId, note });
    return success(res, movements, 'Adjustment processed');
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  handleListMovements,
  handleReceipt,
  handleDelivery,
  handleTransfer,
  handleAdjustment,
};
