const { logEvent } = require('../services/eventlogger');

const eventLoggerMiddleware = (req, res, next) => {
  res.on('finish', () => {
    if (res.statusCode >= 400) return;
    if (!req.event) return;

    const actorId = req.event.actorId || (req.user && req.user._id ? req.user._id.toString() : 'System');
    const payload = { ...req.event, actorId };

    Promise.resolve(logEvent(payload)).catch((err) => {
      console.error('Event logging failed:', err.message);
    });
  });

  next();
};

module.exports = eventLoggerMiddleware;
