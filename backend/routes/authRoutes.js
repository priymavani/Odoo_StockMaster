const express = require('express');
const { body } = require('express-validator');
const { handleRegister, handleLogin, handleMe, handleRequestReset, handleResetPassword } = require('../controllers/authController');
const { requireAuth } = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/rateLimitMiddleware');

const router = express.Router();

const emailValidator = body('email').isEmail().withMessage('Valid email is required');
const passwordValidator = body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters');

router.post(
  '/register',
  authLimiter,
  [
    body('name').notEmpty().withMessage('Name is required'),
    emailValidator,
    passwordValidator,
    body('role').optional().isIn(['admin', 'staff']).withMessage('Invalid role'),
  ],
  handleRegister
);

router.post('/login', authLimiter, [emailValidator, passwordValidator], handleLogin);

router.get('/me', requireAuth, handleMe);

router.post('/request-reset', authLimiter, [emailValidator], handleRequestReset);

router.post(
  '/reset-password',
  authLimiter,
  [emailValidator, body('otp').notEmpty(), body('newPassword').isLength({ min: 8 })],
  handleResetPassword
);

module.exports = router;
