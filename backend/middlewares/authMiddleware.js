const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      return res.status(401).json({ error: true, message: 'Authentication token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = { userId: decoded.userId, role: decoded.role };

    // Lazy-load user when needed; for most routes id/role is enough
    req.getCurrentUser = async () => {
      if (!req.user) {
        req.user = await User.findById(decoded.userId).select('-password');
      }
      return req.user;
    };

    return next();
  } catch (err) {
    console.error('Auth error', err);
    return res.status(401).json({ error: true, message: 'Invalid or expired token' });
  }
}

module.exports = { requireAuth };
