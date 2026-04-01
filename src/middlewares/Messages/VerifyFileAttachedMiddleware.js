const { asyncHandler } = require("./ValidationMiddleware");

/**
 * Verifies a file is attached when message type is 'file'.
 *
 * On failure → passes 400 error to ErrorHandlerMiddleware via next(err).
 */
const verifyFileAttached = asyncHandler(async (req, res, next) => {
  const { type } = req.validatedData;

  if (type === "file" && !req.file) {
    const err = new Error(
      'No file attached. Please upload a file when type is "file".',
    );
    err.statusCode = 400;
    return next(err);
  }

  next();
});

module.exports = verifyFileAttached;
