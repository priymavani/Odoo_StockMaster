const { validationResult } = require('express-validator');
const multer = require('multer');
const {
  listProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  importProductsFromCsv,
} = require('../services/productService');
const { success } = require('../utils/response');

const upload = multer({ storage: multer.memoryStorage() });

async function handleListProducts(req, res, next) {
  try {
    const { page, size, q } = req.query;
    const result = await listProducts({ page, size, q });
    return success(res, result, 'Products list');
  } catch (err) {
    return next(err);
  }
}

async function handleCreateProduct(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: true, message: 'Validation failed', details: errors.array() });
    }
    const data = req.body;
    const product = await createProduct(data, req.auth.userId);
    return success(res, product, 'Product created');
  } catch (err) {
    return next(err);
  }
}

async function handleGetProduct(req, res, next) {
  try {
    const product = await getProductById(req.params.id);
    return success(res, product, 'Product details');
  } catch (err) {
    return next(err);
  }
}

async function handleUpdateProduct(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: true, message: 'Validation failed', details: errors.array() });
    }
    const product = await updateProduct(req.params.id, req.body, req.auth.userId);
    return success(res, product, 'Product updated');
  } catch (err) {
    return next(err);
  }
}

async function handleDeleteProduct(req, res, next) {
  try {
    await deleteProduct(req.params.id, req.auth.userId);
    return success(res, null, 'Product deleted');
  } catch (err) {
    return next(err);
  }
}

async function handleImportProducts(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: true, message: 'CSV file is required' });
    }
    const result = await importProductsFromCsv(req.file.buffer, req.auth.userId);
    return success(res, result, 'Products imported');
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  upload,
  handleListProducts,
  handleCreateProduct,
  handleGetProduct,
  handleUpdateProduct,
  handleDeleteProduct,
  handleImportProducts,
};
