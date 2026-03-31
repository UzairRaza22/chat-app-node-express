const Message = require("../../models/MessageModel");

const { asyncHandler } = require("./ValidationMiddleware");

/**
 * Looks up the message only when messageId is present in the validated payload.
 * When channelId is provided instead (read-all flow), it skips the DB lookup
 * and calls next() immediately — no if/else in the controller needed.
 */
const verifyMessageExists = asyncHandler(async (req, res, next) => {
  const { messageId } = req.validatedData;

  if (!messageId) return next();

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
