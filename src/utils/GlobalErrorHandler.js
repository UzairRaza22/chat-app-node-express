/**
 * GlobalErrorHandler — utils/GlobalErrorHandler.js
 *   isOperational = true  → known error → respond with err.statusCode + err.message
 *   isOperational = false → unexpected crash → respond with generic 500
 *
 * Works for: auth, workspace, team, channel, messages — every module.
 */
const logger = require("./Logger");
const sendErrorToWebhook = require("./WebhookService");

const GlobalErrorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message || "Internal Server Error",
    method: req.method,
    url: req.originalUrl,
    status: err.statusCode || 500,
    ip: req.ip,
    user_id: req.user ? req.user._id : null,
    stack: err.stack,
  });

  // ── Send to webhook ───────────────────────────────────────────────────────
  // Non-blocking — fires and forgets, never delays the response
  sendErrorToWebhook(err, req);

  // ── Defensive response helper (fallback if res.failed is not defined) ──────
  const sendError = (message, data = {}, statusCode = 500) => {
    if (typeof res.failed === "function") {
      return res.failed(message, data, statusCode);
    }
    // Fallback to direct JSON response if res.failed is not available
    return res.status(statusCode).json({
      success: false,
      message,
      data,
    });
  };

  // ── Joi Validation Errors ─────────────────────────────────────────────────
  if (err.isJoi) {
    return sendError(err.details[0].message, { errors: err.details }, 422);
  }

  // ── MongoDB CastError (Invalid ObjectId) ──────────────────────────────────
  if (err.name === "CastError") {
    return sendError("Invalid ID format.", { errors: err.message }, 400);
  }

  // ── MongoDB Duplicate Key Error ───────────────────────────────────────────
  if (err.code === 11000) {
    return sendError("Duplicate field value.", { errors: err.keyValue }, 409);
  }

  // ── GridFS File Storage Errors ────────────────────────────────────────────
  if (err.message && err.message.toLowerCase().includes("GridFs")) {
    return sendError(
      "File storage error. Please try again.",
      { errors: err.message },
      500,
    );
  }

  // ── 400 Bad Request ───────────────────────────────────────────────────────
  if (err.statusCode === 400) {
    return sendError(err.message, { errors: err.errors || {} }, 400);
  }

  // ── 401 Unauthorized ──────────────────────────────────────────────────────
  if (err.statusCode === 401) {
    return sendError(err.message, {}, 401);
  }

  // ── 403 Forbidden ─────────────────────────────────────────────────────────
  if (err.statusCode === 403) {
    return sendError(err.message, {}, 403);
  }

  // ── 404 Not Found ─────────────────────────────────────────────────────────
  if (err.statusCode === 404) {
    return sendError(err.message, {}, 404);
  }

  // ── Operational Errors (isOperational = true) ─────────────────────────────
  if (err.isOperational) {
    return sendError(err.message, {}, err.statusCode);
  }

  // ── Default — unexpected / unhandled errors ───────────────────────────────
  return sendError("Internal Server Error", {}, 500);
};

module.exports = GlobalErrorHandler;
