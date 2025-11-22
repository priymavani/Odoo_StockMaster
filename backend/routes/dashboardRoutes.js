const express = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const { handleDashboard } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/', requireAuth, handleDashboard);

module.exports = router;
