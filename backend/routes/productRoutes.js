const express = require('express');
const { body } = require('express-validator');
const { requireAuth } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');
const {
  upload,
  handleListProducts,
  handleCreateProduct,
  handleGetProduct,
  handleUpdateProduct,
  handleDeleteProduct,
  handleImportProducts,
} = require('../controllers/productController');

const router = express.Router();

const productValidators = [
  body('name').notEmpty().withMessage('Name is required'),
  body('sku').notEmpty().withMessage('SKU is required'),
  body('uom').notEmpty().withMessage('Unit of measure is required'),
  body('reorderLevel').optional().isNumeric(),
];

router.get('/', requireAuth, handleListProducts);

router.post('/', requireAuth, requireRole(['admin']), productValidators, handleCreateProduct);

router.get('/:id', requireAuth, handleGetProduct);

router.put('/:id', requireAuth, requireRole(['admin']), productValidators, handleUpdateProduct);

router.delete('/:id', requireAuth, requireRole(['admin']), handleDeleteProduct);

router.post(
  '/import',
  requireAuth,
  requireRole(['admin']),
  upload.single('file'),
  handleImportProducts
);

module.exports = router;
