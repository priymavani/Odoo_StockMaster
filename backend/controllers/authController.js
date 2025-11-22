const { validationResult } = require('express-validator');
const {
  registerUser,
  loginUser,
  getCurrentUser,
  requestPasswordReset,
  resetPassword,
} = require('../services/authService');
const { success } = require('../utils/response');

async function handleRegister(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: true, message: 'Validation failed', details: errors.array() });
    }
    const { name, email, password, role } = req.body;
    const result = await registerUser({ name, email, password, role });
    return success(res, result, 'User registered');
  } catch (err) {
    return next(err);
  }
}

async function handleLogin(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: true, message: 'Validation failed', details: errors.array() });
    }
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    return success(res, result, 'Login successful');
  } catch (err) {
    return next(err);
  }
}

async function handleMe(req, res, next) {
  try {
    const user = await getCurrentUser(req.auth.userId);
    return success(res, user, 'Current user');
  } catch (err) {
    return next(err);
  }
}

async function handleRequestReset(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: true, message: 'Validation failed', details: errors.array() });
    }
    const { email } = req.body;
    await requestPasswordReset(email);
    return success(res, null, 'If this email exists, an OTP has been generated');
  } catch (err) {
    return next(err);
  }
}

async function handleResetPassword(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: true, message: 'Validation failed', details: errors.array() });
    }
    const { email, otp, newPassword } = req.body;
    await resetPassword({ email, otp, newPassword });
    return success(res, null, 'Password reset successful');
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  handleRegister,
  handleLogin,
  handleMe,
  handleRequestReset,
  handleResetPassword,
};
