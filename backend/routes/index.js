const express = require('express');
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const locationRoutes = require('./locationRoutes');
const movementRoutes = require('./movementRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const debugRoutes = require('./debugRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/locations', locationRoutes);
router.use('/', movementRoutes); // receipts, deliveries, transfers, movements list
router.use('/dashboard', dashboardRoutes);
router.use('/debug', debugRoutes);

module.exports = router;
