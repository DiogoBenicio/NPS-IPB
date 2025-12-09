const logger = require('../logger');

module.exports = function loggerMiddleware(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('request_finished', {
      method: req.method,
      path: req.originalUrl || req.url,
      status: res.statusCode,
      duration_ms: duration,
      requestId: req.id,
      ip: req.ip,
    });
  });
  logger.info('request_started', {
    method: req.method,
    path: req.originalUrl || req.url,
    requestId: req.id,
    ip: req.ip,
  });
  next();
};
