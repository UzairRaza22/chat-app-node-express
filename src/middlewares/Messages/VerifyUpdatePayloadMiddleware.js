const { asyncHandler } = require("./ValidationMiddleware");

/**
 * Verifies the update payload matches the message type.
 *   text message → content field must be present
 *   file message → a new file must be attached
 *
 * On failure → passes 400 error to ErrorHandlerMiddleware via next(err).
 */
const verifyUpdatePayload = asyncHandler(async (req, res, next) => {
  const message = req.message;
  const { content } = req.validatedData;

  if (message.type === "text" && !content) {
    const err = new Error("content is required to update a text message.");
    err.statusCode = 400;
    return next(err);
  }

  if (message.type === "file" && !req.file) {
    const err = new Error("A new file is required to update a file message.");
    err.statusCode = 400;
    return next(err);
  }

  next();
});

module.exports = verifyUpdatePayload;
