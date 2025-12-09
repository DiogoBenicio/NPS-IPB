const logger = require('../logger');

function isPrismaError(err) {
  return err && err.code && err.clientVersion;
}

function errorHandler(err, req, res, _next) {
  const status = err.statusCode || 500;
  const message = err.expose ? err.message : 'Internal server error';

  const meta = {
    requestId: req.id,
    method: req.method,
    path: req.originalUrl || req.url,
    params: req.params,
    query: req.query,
  };

  if (req.body) {
    meta.body = req.body;
  }

  if (isPrismaError(err)) {
    meta.prisma = {
      code: err.code,
      meta: err.meta,
    };
  }

  // Proteger acesso quando err puder ser indefinido ou sem stack
  const logMeta = { message: err && err.message, stack: err && err.stack, status };
  // merge without spread to satisfy Node rules
  if (meta) {
    logMeta.requestId = meta.requestId;
    logMeta.method = meta.method;
    logMeta.path = meta.path;
    logMeta.params = meta.params;
    logMeta.query = meta.query;
    if (meta.body) logMeta.body = meta.body;
    if (meta.prisma) logMeta.prisma = meta.prisma;
  }
  logger.error('unhandled_error', logMeta);

  const responsePayload = {
    error: {
      message,
      requestId: req.id,
    },
  };
  if (process.env.NODE_ENV !== 'production') {
    responsePayload.error.details = err.message;
  }

  res.status(status).json(responsePayload);
}

module.exports = errorHandler;
