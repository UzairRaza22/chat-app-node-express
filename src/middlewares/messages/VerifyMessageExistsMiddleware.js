const Message = require('../../models/messagemodel');
const { asyncHandler } = require('../responsehandlermiddleware');
const AppError = require('../../utils/apperror');

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
    return next(new AppError("Message not found.", 404));
  }

  req.message = message;
  next();
});

module.exports = verifyMessageExists;
