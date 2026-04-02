const { asyncHandler } = require("../Validate");

const verifyMessageOwner = asyncHandler(async (req, res, next) => {
  const message = req.message;
  const userId = req.user._id;

  if (message.senderId.toString() !== userId.toString()) {
    return next(
      new AppError("You are not authorized to modify this message.", 403),
    );
  }

  next();
});

module.exports = verifyMessageOwner;
