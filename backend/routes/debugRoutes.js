const express = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');
const { handleDebugState } = require('../controllers/debugController');

const router = express.Router();

router.get('/state', requireAuth, requireRole(['admin']), handleDebugState);

module.exports = router;
