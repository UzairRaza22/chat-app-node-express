const fs = require('fs');
const path = require('path');
const os = require('os');

const LOGS_DIR = path.join(process.cwd(), 'logs');
const COMBINED_LOG = path.join(LOGS_DIR, 'combined.log');
const ERROR_LOG = path.join(LOGS_DIR, 'error.log');

// Ensure logs directory exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

// Lazy-loaded to avoid circular dependency at startup
let LogModel = null;
const getLogModel = () => {
  if (!LogModel) {
    try {
      LogModel = require('../models/logmodel');
    } catch (e) {
      // Model not available yet (DB not connected)
    }
  }
  return LogModel;
};

const SERVER_HOST = os.hostname();

/**
 * Custom Logger Utility
 * Writes to local files AND shared MongoDB
 */
class Logger {
  constructor() {
    this.levels = {
      INFO: 'INFO',
      WARN: 'WARN',
      ERROR: 'ERROR',
    };
  }

  /**
   * Format message with timestamp and level
   */
  _format(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${level}: ${message}\n`;
  }

  /**
   * Write to local log files (async, non-blocking)
   */
  _writeFile(formattedMessage, isError = false) {
    fs.appendFile(COMBINED_LOG, formattedMessage, (err) => {
      if (err) console.error('Failed to write to combined.log:', err.message);
    });

    if (isError) {
      fs.appendFile(ERROR_LOG, formattedMessage, (err) => {
        if (err) console.error('Failed to write to error.log:', err.message);
      });
    }
  }

  /**
   * Write to MongoDB (async, non-blocking, fire-and-forget)
   */
  _writeMongo(level, message, metadata = {}) {
    const Log = getLogModel();
    if (!Log) return;

    Log.create({
      level,
      message,
      serverHost: SERVER_HOST,
      ...metadata
    }).catch(() => {
      // Silently fail — logging should never crash the app
    });
  }

  info(message, metadata = {}) {
    const formatted = this._format(this.levels.INFO, message);
    console.log(formatted.trim());
    this._writeFile(formatted);
    this._writeMongo(this.levels.INFO, message, metadata);
  }

  warn(message, metadata = {}) {
    const formatted = this._format(this.levels.WARN, message);
    console.warn(formatted.trim());
    this._writeFile(formatted);
    this._writeMongo(this.levels.WARN, message, metadata);
  }

  error(message, stack = '', metadata = {}) {
    const fullMessage = stack ? `${message}\nStack: ${stack}` : message;
    const formatted = this._format(this.levels.ERROR, fullMessage);
    console.error(formatted.trim());
    this._writeFile(formatted, true);
    this._writeMongo(this.levels.ERROR, message, { stack, ...metadata });
  }
}

module.exports = new Logger();
