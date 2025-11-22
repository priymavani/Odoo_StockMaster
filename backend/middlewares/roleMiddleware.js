function requireRole(roles) {
  return (req, res, next) => {
    const role = req.auth?.role;
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ error: true, message: 'Forbidden: insufficient permissions' });
    }
    return next();
  };
}

module.exports = { requireRole };
