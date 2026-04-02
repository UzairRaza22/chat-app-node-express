/**
 * middlewares/validate.js
 *
 * Global validation middleware + asyncHandler for the entire application.
 * Used by every module: auth, workspace, team, channel, messages.
 *
 * asyncHandler is exported from here — no separate utils/asyncHandler.js needed.
 * Every middleware and controller imports asyncHandler from this file.
 *
 * Usage in any route:
 *   const { validate, validateQuery } = require("../middlewares/validate");
 *
 * Usage in any middleware or controller:
 *   const { asyncHandler } = require("../middlewares/validate");
 */

// ── asyncHandler ──────────────────────────────────────────────────────────────
// Wraps any async function — catches thrown errors and forwards to
// ErrorHandlerMiddleware via next(err). Used across every module.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ── validate ──────────────────────────────────────────────────────────────────
// Validates req.body against a Joi schema.
// On failure → next(err) with statusCode 400 → ErrorHandlerMiddleware
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body);

  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    return next(err);
  }

  req.validatedData = value;
  next();
};

// ── validateQuery ─────────────────────────────────────────────────────────────
// Validates req.query against a Joi schema.
// On failure → next(err) with statusCode 400 → ErrorHandlerMiddleware
const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query);

  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    return next(err);
  }

  req.validatedData = value;
  next();
};

module.exports = { asyncHandler, validate, validateQuery };
