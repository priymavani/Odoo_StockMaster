const express = require('express');
const { body } = require('express-validator');
const { requireAuth } = require('../middlewares/authMiddleware');
const {
  handleListMovements,
  handleReceipt,
  handleDelivery,
  handleTransfer,
  handleAdjustment,
} = require('../controllers/movementController');

const router = express.Router();

const lineValidatorsBase = [
  body('lines').isArray({ min: 1 }).withMessage('At least one line is required'),
  body('lines.*.productId').notEmpty().withMessage('productId is required'),
  body('lines.*.qty').isNumeric().withMessage('qty must be numeric'),
];

router.get('/movements', requireAuth, handleListMovements);

router.post(
  '/receipts',
  requireAuth,
  [
    ...lineValidatorsBase,
    body('lines.*.toLocationId').notEmpty().withMessage('toLocationId is required'),
  ],
  handleReceipt
);

router.post(
  '/deliveries',
  requireAuth,
  [
    ...lineValidatorsBase,
    body('lines.*.fromLocationId').notEmpty().withMessage('fromLocationId is required'),
  ],
  handleDelivery
);

router.post(
  '/transfers',
  requireAuth,
  [
    ...lineValidatorsBase,
    body('lines.*.fromLocationId').notEmpty().withMessage('fromLocationId is required'),
    body('lines.*.toLocationId').notEmpty().withMessage('toLocationId is required'),
  ],
  handleTransfer
);

router.post(
  '/adjustments',
  requireAuth,
  [
    body('lines').isArray({ min: 1 }).withMessage('At least one line is required'),
    body('lines.*.productId').notEmpty(),
    body('lines.*.qty').isNumeric().withMessage('qty must be numeric (delta, can be negative)'),
    body('lines.*.toLocationId').notEmpty().withMessage('toLocationId is required'),
  ],
  handleAdjustment
);

module.exports = router;
