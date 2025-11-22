// routes/productRoutes.js

const express = require('express');
const {
    createProduct,
    getProducts,
    getProductBySku,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const router = express.Router();

// Define routes using SKU code as identifier
router.route('/')
    .post(createProduct) // POST /api/products
    .get(getProducts);   // GET /api/products

router.route('/:sku')
    .get(getProductBySku)   // GET /api/products/:sku
    .put(updateProduct)     // PUT /api/products/:sku
    .delete(deleteProduct); // DELETE /api/products/:sku

module.exports = router;