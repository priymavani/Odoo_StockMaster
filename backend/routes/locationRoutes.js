const express = require('express');
const { body } = require('express-validator');
const { requireAuth } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');
const {
  handleListLocations,
  handleCreateLocation,
  handleGetLocation,
  handleUpdateLocation,
  handleDeleteLocation,
} = require('../controllers/locationController');

const router = express.Router();

const locationValidators = [
  body('name').notEmpty().withMessage('Name is required'),
  body('code').notEmpty().withMessage('Code is required'),
];

router.get('/', requireAuth, handleListLocations);
router.post('/', requireAuth, requireRole(['admin']), locationValidators, handleCreateLocation);
router.get('/:id', requireAuth, handleGetLocation);
router.put('/:id', requireAuth, requireRole(['admin']), locationValidators, handleUpdateLocation);
router.delete('/:id', requireAuth, requireRole(['admin']), handleDeleteLocation);

module.exports = router;
