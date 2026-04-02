/**
 * GlobalResponseHandler — utils/GlobalResponseHandler.js
 *
 * Does two things:
 *
 * 1. Middleware — registered in app.js via app.use(GlobalResponseHandler).
 *    Attaches res.success() and res.failed() to every request across the
 *    entire application — auth, workspace, team, channel, messages.
 *
 * 2. createError() — absorbs AppError.js logic.
 *    Factory function used by every middleware across the whole app
 *    to create structured operational errors instead of a separate AppError class.
 *    Sets isOperational = true so ErrorHandlerMiddleware knows it is a
 *    known, expected error — not an unexpected server crash.
 *
 * ─── Usage in any controller ────────────────────────────────────────────────
 *   res.success("User created.", { user }, 201)
 *   res.success("Data fetched.", { items })
 *
 * ─── Usage in any middleware (replaces AppError and raw Error pattern) ──────
 *   const { createError } = require("../../utils/GlobalResponseHandler");
 *
 *   return next(createError("Message not found.", 404));
 *   return next(createError("You are not a member of this channel.", 403));
 *   return next(createError("Invalid credentials.", 401));
 */

// ── createError ───────────────────────────────────────────────────────────────
// Replaces: new AppError(message, statusCode)
// Replaces: const err = new Error(msg); err.statusCode = X; next(err);
//
// isOperational = true  → ErrorHandlerMiddleware treats it as a known error
//                         and responds with err.statusCode + err.message
// isOperational = false → ErrorHandlerMiddleware treats it as unexpected crash
//                         and responds with generic 500
const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.isOperational = true;
  Error.captureStackTrace(err, createError);
  return err;
};

// ── GlobalResponseHandler middleware ─────────────────────────────────────────
const GlobalResponseHandler = (req, res, next) => {
  res.success = (message, data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  };

  res.failed = (message, data = {}, statusCode = 400) => {
    return res.status(statusCode).json({
      success: false,
      message,
      data,
    });
  };

  next();
};

module.exports = { GlobalResponseHandler, createError };
