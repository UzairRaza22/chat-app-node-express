const Message = require("../../models/MessageModel");
const { asyncHandler } = require("./ValidationMiddleware");

/**
 * Looks up the message only when messageId is present in the validated payload.
 * When channelId is provided (read-all flow), skips DB lookup and calls next().
 *
 * On failure → passes 404 error to ErrorHandlerMiddleware via next(err).
 */
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
