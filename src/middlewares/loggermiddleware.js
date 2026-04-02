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
 * Logs every request/response with structured data to MongoDB and console
 */
const loggerMiddleware = (req, res, next) => {
  const { method, url, ip, body } = req;
  const startTime = process.hrtime();

  // Log Outgoing Response (and request data) on Finish
  res.on('finish', () => {
    const diff = process.hrtime(startTime);
    const responseTimeMs = Math.round(diff[0] * 1e3 + diff[1] * 1e-6); // Structured response_time as number
    const { statusCode } = res;
    
    const sanitizedBody = sanitize(body);

    const logData = {
      message: `${method} ${url} - Status: ${statusCode} - Time: ${responseTimeMs}ms`,
      method,
      url,
      status: statusCode,
      ip,
      user_id: req.user ? req.user._id : null,
      request_body: sanitizedBody,
      response_time: responseTimeMs
    };

    if (statusCode >= 400) {
      logger.warn(logData);
    } else {
      logger.info(logData);
    }
  });

  next();
};

module.exports = loggerMiddleware;
