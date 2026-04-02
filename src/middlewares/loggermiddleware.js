const logger = require('../utils/logger');

/**
 * Sensitive fields to sanitize from logs
 */
const SENSITIVE_FIELDS = ['password', 'token', 'access_token', 'refreshToken', 'resetToken', 'verifyToken'];

/**
 * Sanitize sensitive fields from object
 */
const sanitize = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const sanitized = { ...obj };

  SENSITIVE_FIELDS.forEach(field => {
    if (sanitized[field]) sanitized[field] = '*****';
  });

  return sanitized;
};

/**
 * Global Logger Middleware
 * Logs every request/response to local files AND shared MongoDB
 */
const loggerMiddleware = (req, res, next) => {
  const { method, url, ip, body } = req;
  const startTime = process.hrtime();

  // Log Incoming Request
  const sanitizedBody = sanitize(body);
  const bodyStr = Object.keys(sanitizedBody || {}).length > 0 ? JSON.stringify(sanitizedBody) : '{}';

  logger.info(`Incoming Request: ${method} ${url} - IP: ${ip} - Body: ${bodyStr}`, {
    method,
    url,
    ip,
    userId: req.user ? req.user._id : null
  });

  // Log Outgoing Response on Finish
  res.on('finish', () => {
    const diff = process.hrtime(startTime);
    const responseTimeMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    const { statusCode } = res;

    const message = `Outgoing Response: ${method} ${url} - Status: ${statusCode} - Time: ${responseTimeMs}ms`;
    const metadata = {
      method,
      url,
      ip,
      statusCode,
      responseTime: `${responseTimeMs}ms`,
      userId: req.user ? req.user._id : null
    };

    if (statusCode >= 400) {
      logger.warn(message, metadata);
    } else {
      logger.info(message, metadata);
    }
  });

  next();
};

module.exports = loggerMiddleware;
