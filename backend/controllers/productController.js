// controllers/productController.js

const Product = require('../models/Product');

// --- 1. CREATE Product (POST /api/products) ---
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        // Handle unique constraint error (e.g., SKU already exists)
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'SKU code already exists.' });
        }
        res.status(400).json({ success: false, message: error.message });
    }
};

// --- 2. READ ALL Products (GET /api/products) ---
exports.getProducts = async (req, res) => {
    try {
        // Only fetch active products by default
        const products = await Product.find({ is_active: true });
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching products' });
    }
};

// --- 3. READ Single Product (GET /api/products/:sku) ---
exports.getProductBySku = async (req, res) => {
    try {
        // Find product by SKU and ensure it is active
        const product = await Product.findOne({ sku_code: req.params.sku, is_active: true });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- 4. UPDATE Product (PUT /api/products/:sku) ---
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            { sku_code: req.params.sku }, // Find by SKU
            req.body, // Update data
            {
                new: true, // Return the updated document
                runValidators: true // Check schema validators
            }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found for update.' });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// --- 5. DELETE Product (DELETE /api/products/:sku) ---
exports.deleteProduct = async (req, res) => {
    try {
        // Soft delete: Change is_active to false instead of removing from DB
        const product = await Product.findOneAndUpdate(
            { sku_code: req.params.sku },
            { is_active: false },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found for deletion.' });
        }

        res.status(200).json({ success: true, message: 'Product successfully archived (soft-deleted).' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};