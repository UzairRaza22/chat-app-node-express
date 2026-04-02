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
let ActivityLog = null;
const getActivityLogModel = () => {
  if (!ActivityLog) {
    try {
      ActivityLog = require('../models/ActivityLogModel');
    } catch (e) {
      // Model not available yet (DB not connected)
    }
  }
  return ActivityLog;
};

/**
 * Custom Logger Utility
 * Writes to local files AND shared MongoDB
 */
class Logger {
  constructor() {
    this.levels = {
      INFO: 'info',
      WARN: 'warn',
      ERROR: 'error',
    };
  }

  /**
   * Format message with timestamp and level for terminal/file
   */
  _format(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${level.toUpperCase()}: ${message}\n`;
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
  async _writeMongo(level, data) {
    const Model = getActivityLogModel();
    if (!Model) return;

    try {
      // Ensure we have a message and a type
      const logData = {
        type: level,
        message: data.message || 'No message provided',
        ...data
      };
      
      // Fire and forget
      Model.create(logData).catch(err => {
          console.error("Log DB Error:", err.message);
      });
    } catch (err) {
      console.error("Log DB Error:", err.message);
    }
  }

  info(messageOrData) {
    const data = typeof messageOrData === 'object' ? messageOrData : { message: messageOrData };
    const formatted = this._format(this.levels.INFO, data.message);
    
    console.log(formatted.trim());
    this._writeFile(formatted);
    this._writeMongo(this.levels.INFO, data);
  }

  warn(messageOrData) {
    const data = typeof messageOrData === 'object' ? messageOrData : { message: messageOrData };
    const formatted = this._format(this.levels.WARN, data.message);
    
    console.warn(formatted.trim());
    this._writeFile(formatted);
    this._writeMongo(this.levels.WARN, data);
  }

  error(messageOrData, stack = '') {
    const data = typeof messageOrData === 'object' ? messageOrData : { message: messageOrData, stack };
    const fullMessage = data.stack ? `${data.message}\nStack: ${data.stack}` : data.message;
    const formatted = this._format(this.levels.ERROR, fullMessage);
    
    console.error(formatted.trim());
    this._writeFile(formatted, true);
    this._writeMongo(this.levels.ERROR, data);
  }
}

module.exports = new Logger();
