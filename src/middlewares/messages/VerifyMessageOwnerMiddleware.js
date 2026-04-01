const { asyncHandler } = require("../ResponseHandlerMiddleware");
const AppError = require("../../utils/AppError");

/**
 * Verifies the logged-in user is the sender of the message.
 *
 * On failure → passes 403 error to ErrorHandlerMiddleware via next(err).
 */
const verifyMessageOwner = asyncHandler(async (req, res, next) => {
  const message = req.message;
  const userId = req.user._id;

  if (message.senderId.toString() !== userId.toString()) {
    return next(new AppError("You are not authorized to modify this message.", 403));
  }

  next();
});

module.exports = verifyMessageOwner;
