const { asyncHandler } = require("../validation.middleware");

const verifyMessageOwner = asyncHandler(async (req, res, next) => {
  const message = req.message;
  const userId = req.user._id;

  if (message.senderId.toString() !== userId.toString()) {
    return res.status(403).json({
      message: "You are not authorized to modify this message.",
    });
  }

  next();
});

module.exports = verifyMessageOwner;
