const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const logger = require('./logger');
const requestId = require('./middlewares/requestId');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const errorHandler = require('./middlewares/errorHandler');

app.use(cors());
// Security headers
app.use(helmet());
// Basic rate limiting for all requests
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.use(express.json());
app.use(requestId);
app.use(loggerMiddleware);

// Debug route to inspect loaded routes
app.get('/debug/routes', (req, res) => {
  if (!app._router) return res.json({ routes: [] });
  const routes = app._router.stack.map((r) => {
    return {
      name: r.name,
      route: r.route ? { path: r.route.path, methods: r.route.methods } : undefined,
      regexp: r.regexp && r.regexp.source,
    };
  });
  res.json({ routes });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/responses', require('./routes/responses'));

// Debug: show routes registered under /api
app.get('/api/debug/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach((layer) => {
    if (layer && layer.regexp && layer.regexp.source) {
      // Extract mounted path from regexp source
      const pathMatch = layer.regexp.source.match(/\/(.*)\//);
      routes.push({
        name: layer.name,
        regexp: layer.regexp.source,
        pathMatch: pathMatch ? pathMatch[1] : null,
      });
    }
  });
  res.json({ routes });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

// Uncaught exceptions & rejections
process.on('uncaughtException', (err) => {
  logger.error('uncaught_exception', {
    message: err.message,
    stack: err.stack,
  });
  // Avoid process.exit to satisfy lint rules
});

process.on('unhandledRejection', (reason) => {
  logger.error('unhandled_rejection', { reason });
  // Avoid process.exit to satisfy lint rules
});

module.exports = app;
