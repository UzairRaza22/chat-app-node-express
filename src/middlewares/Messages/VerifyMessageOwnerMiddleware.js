const { asyncHandler } = require("../Validate");

const verifyMessageOwner = asyncHandler(async (req, res, next) => {
  const message = req.message;
  const userId = req.user._id;

  if (message.senderId.toString() !== userId.toString()) {
    const err = new Error("You are not authorized to modify this message.");
    err.statusCode = 403;
    return next(err);
  }

  next();
});

module.exports = verifyMessageOwner;
