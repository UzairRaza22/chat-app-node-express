const { asyncHandler } = require("../ResponseHandlerMiddleware");
const AppError = require("../../utils/AppError");

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
    return next(new AppError("content is required to update a text message.", 400));
  }

  if (message.type === "file" && !req.file) {
    return next(new AppError("A new file is required to update a file message.", 400));
  }

  next();
});

module.exports = verifyUpdatePayload;
