const { asyncHandler } = require("../ResponseHandlerMiddleware");
const AppError = require("../../utils/AppError");

/**
 * Verifies a file is attached when message type is 'file'.
 *
 * On failure → passes 400 error to ErrorHandlerMiddleware via next(err).
 */
const verifyFileAttached = asyncHandler(async (req, res, next) => {
  const { type } = req.validatedData;

  if (type === "file" && !req.file) {
    return next(new AppError('No file attached. Please upload a file when type is "file".', 400));
  }

  next();
});

module.exports = verifyFileAttached;
