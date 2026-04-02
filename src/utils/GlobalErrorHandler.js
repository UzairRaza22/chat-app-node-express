/**
 * GlobalErrorHandler — utils/GlobalErrorHandler.js
 *
 * Registered last in app.js via app.use(GlobalErrorHandler).
 * Catches all next(err) calls from every module across the entire application.
 * Uses res.failed() from GlobalResponseHandler for all error responses.
 *
 * Uses err.isOperational (set by createError in GlobalResponseHandler) to
 * distinguish known expected errors from unexpected server crashes.
 *
 *   isOperational = true  → known error → respond with err.statusCode + err.message
 *   isOperational = false → unexpected crash → respond with generic 500
 *
 * Works for: auth, workspace, team, channel, messages — every module.
 */
const logger = require('./logger');

const GlobalErrorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message || 'Internal Server Error',
    method: req.method,
    url: req.originalUrl,
    status: err.statusCode || 500,
    ip: req.ip,
    user_id: req.user ? req.user._id : null,
    stack: err.stack
  });

  // ── Joi Validation Errors ─────────────────────────────────────────────────
  // Any module using validate() or validateQuery() with Joi schemas
  if (err.isJoi) {
    return res.failed(err.details[0].message, { errors: err.details }, 422);
  }

  // ── MongoDB CastError (Invalid ObjectId) ──────────────────────────────────
  // Any module where an invalid ObjectId is passed as a param or body field
  if (err.name === "CastError") {
    return res.failed("Invalid ID format.", { errors: err.message }, 400);
  }

  // ── MongoDB Duplicate Key Error ───────────────────────────────────────────
  // Any module where a unique field is violated — e.g. duplicate email in auth
  if (err.code === 11000) {
    return res.failed("Duplicate field value.", { errors: err.keyValue }, 409);
  }

  // ── GridFS File Storage Errors ────────────────────────────────────────────
  // From: HandleFileUploadMiddleware  → upload failed
  // From: HandleFileUpdateMiddleware  → update failed
  // From: HandleFileDeleteMiddleware  → delete failed
  // From: StreamFileMiddleware        → download failed
  if (err.message && err.message.toLowerCase().includes("gridfs")) {
    return res.failed(
      "File storage error. Please try again.",
      { errors: err.message },
      500,
    );
  }

  // ── 400 Bad Request ───────────────────────────────────────────────────────
  // From: validate() / validateQuery()     → schema validation failed
  // From: VerifyFileAttachedMiddleware     → no file attached
  // From: VerifyUpdatePayloadMiddleware    → content or file missing on update
  // From: any module's 400 checks
  if (err.statusCode === 400) {
    return res.failed(err.message, {}, 400);
  }

  // ── 401 Unauthorized ──────────────────────────────────────────────────────
  // From: auth middleware in any module    → invalid or missing token
  if (err.statusCode === 401) {
    return res.failed(err.message, {}, 401);
  }

  // ── 403 Forbidden ─────────────────────────────────────────────────────────
  // From: VerifyChannelMemberMiddleware    → not a channel member
  // From: VerifyMessageOwnerMiddleware     → not message owner
  // From: any module's permission checks
  if (err.statusCode === 403) {
    return res.failed(err.message, {}, 403);
  }

  // ── 404 Not Found ─────────────────────────────────────────────────────────
  // From: VerifyMessageExistsMiddleware    → message not found
  // From: any module's resource existence checks
  if (err.statusCode === 404) {
    return res.failed(err.message, {}, 404);
  }

  // ── Operational Errors (isOperational = true) ─────────────────────────────
  // Catches any other known errors created by createError() that don't match
  // the specific statusCode blocks above — e.g. 409, 422, or any future codes.
  if (err.isOperational) {
    return res.failed(err.message, {}, err.statusCode);
  }

  // ── Default — unexpected / unhandled errors ───────────────────────────────
  // isOperational = false — something crashed unexpectedly
  // Never expose internal error details to the client in production
  return res.failed("Internal Server Error", {}, 500);
};

module.exports = GlobalErrorHandler;
