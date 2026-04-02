const logger = require("../utils/logger");

const ErrorHandlerMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log the full error to our custom logger
  const logData = {
    message: err.message,
    method: req.method,
    url: req.originalUrl,
    status: err.statusCode || 500,
    ip: req.ip,
    user_id: req.user ? req.user._id : null
  };

  if (logData.status === 500) {
    logger.error(logData, err.stack);
  } else {
    logger.error(logData);
  }

  // ── Joi Validation Errors ─────────────────────────────────────────────────
  if (err.isJoi) {
    return res.status(422).json({
      success: false,
      message: err.details[0].message,
      errors: err.details,
    });
  }

  // ── MongoDB CastError (Invalid ObjectId) ──────────────────────────────────
  // Triggered when messageId or channelId is not a valid 24-char hex ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format.",
      errors: err.message,
    });
  }

  // ── MongoDB Duplicate Key Error ───────────────────────────────────────────
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate field value.",
      errors: err.keyValue,
    });
  }

  // ── 400 Bad Request Errors ────────────────────────────────────────────────
  // From: VerifyFileAttachedMiddleware  → No file attached
  // From: VerifyUpdatePayloadMiddleware → content required / new file required
  // From: validate()                   → Joi schema validation failed
  // From: checkMembersExist            → Failed to add members to workspace
  if (err.statusCode === 400) {
    const response = {
      success: false,
      message: err.message,
    };
    
    // Include errors data if available (for member addition failures)
    if (err.errors) {
      response.errors = err.errors;
    }
    
    return res.status(400).json(response);
  }

  // ── 403 Forbidden Errors ──────────────────────────────────────────────────
  // From: VerifyChannelMemberMiddleware → You are not a member of this channel
  // From: VerifyMessageOwnerMiddleware  → You are not authorized to modify this message
  if (err.statusCode === 403) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  // ── 404 Not Found Errors ──────────────────────────────────────────────────
  // From: VerifyMessageExistsMiddleware → Message not found
  if (err.statusCode === 404) {
    return res.status(404).json({
      success: false,
      message: err.message,
    });
  }

  // ── GridFS File Storage Errors ────────────────────────────────────────────
  // From: HandleFileUploadMiddleware   → uploadFileToGridFS failed
  // From: HandleFileUpdateMiddleware   → updateFileInGridFS failed
  // From: HandleFileDeleteMiddleware   → deleteFileFromGridFS failed
  // From: StreamFileMiddleware         → downloadFileFromGridFS failed
  if (err.message && err.message.toLowerCase().includes("gridfs")) {
    return res.status(500).json({
      success: false,
      message: "File storage error. Please try again.",
      errors: err.message,
    });
  }

  // ── Default — unhandled / unexpected errors ───────────────────────────────
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
};

const successResponse = (req, res, next) => {
  res.success = (data, statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      ...data
    });
  };
  next();
};

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
        error.isJoi = true;
        return next(error);
    }
    req.validatedData = value;
    next();
};

module.exports = {
  errorHandler: ErrorHandlerMiddleware,
  successResponse,
  asyncHandler,
  validate
};
