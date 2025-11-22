function notFoundHandler(req, res, next) {
  res.status(404).json({ error: true, message: 'Resource not found' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error('Unhandled error:', err);
  const status = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  const details = err.details || undefined;

  res.status(status).json({ error: true, message, ...(details && { details }) });
}

module.exports = { notFoundHandler, errorHandler };
