const Message = require("../../models/message.model");
const { asyncHandler } = require("../validation.middleware");

const verifyMessageExists = asyncHandler(async (req, res, next) => {
  const { messageId } = req.validatedData;

  const message = await Message.findOne({ _id: messageId, isDeleted: false });

  if (!message) {
    return res.status(404).json({
      message: "Message not found.",
    });
  }

  req.message = message;
  next();
});

module.exports = verifyMessageExists;
