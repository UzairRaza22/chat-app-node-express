const Message = require("../../models/MessageModel");
const { asyncHandler } = require("../Validate");

const verifyMessageExists = asyncHandler(async (req, res, next) => {
  const { messageId } = req.validatedData;

  if (!messageId) return next();

  const message = await Message.findOne({ _id: messageId, isDeleted: false });

  if (!message) {
    const err = new Error("Message not found.");
    err.statusCode = 404;
    return next(err);
  }

  req.message = message;
  next();
});

module.exports = verifyMessageExists;
