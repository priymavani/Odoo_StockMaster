const { validationResult } = require('express-validator');
const Location = require('../models/Location');
const { logAudit } = require('../services/auditService');
const { success } = require('../utils/response');

async function handleListLocations(req, res, next) {
  try {
    const locations = await Location.find({}).sort({ name: 1 });
    return success(res, locations, 'Locations list');
  } catch (err) {
    return next(err);
  }
}

async function handleCreateLocation(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: true, message: 'Validation failed', details: errors.array() });
    }
    const location = await Location.create(req.body);
    await logAudit({ userId: req.auth.userId, action: 'create', entity: 'Location', entityId: location._id, payload: req.body });
    return success(res, location, 'Location created');
  } catch (err) {
    return next(err);
  }
}

async function handleGetLocation(req, res, next) {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ error: true, message: 'Location not found' });
    }
    return success(res, location, 'Location details');
  } catch (err) {
    return next(err);
  }
}

async function handleUpdateLocation(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: true, message: 'Validation failed', details: errors.array() });
    }
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!location) {
      return res.status(404).json({ error: true, message: 'Location not found' });
    }
    await logAudit({ userId: req.auth.userId, action: 'update', entity: 'Location', entityId: location._id, payload: req.body });
    return success(res, location, 'Location updated');
  } catch (err) {
    return next(err);
  }
}

async function handleDeleteLocation(req, res, next) {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({ error: true, message: 'Location not found' });
    }
    await logAudit({ userId: req.auth.userId, action: 'delete', entity: 'Location', entityId: location._id, payload: {} });
    return success(res, null, 'Location deleted');
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  handleListLocations,
  handleCreateLocation,
  handleGetLocation,
  handleUpdateLocation,
  handleDeleteLocation,
};
