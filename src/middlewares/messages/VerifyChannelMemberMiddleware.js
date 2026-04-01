const Channel = require('../../models/channelmodel');
const { asyncHandler } = require('../responsehandlermiddleware');
const AppError = require('../../utils/apperror');

/**
 * Verifies the logged-in user is a member of the channel.
 * members is an array of objects: [{ user_id, role, _id }, ...]
 * Uses "members.user_id" dot notation to match the nested field.
 *
 * On failure â†’ passes 403 error to ErrorHandlerMiddleware via next(err).
 */
const verifyChannelMember = asyncHandler(async (req, res, next) => {
  const { channelId } = req.validatedData;
  const userId = req.user._id;

  const channel = await Channel.findOne({
    _id: channelId,
    "members.user_id": String(userId),
  });

  if (!channel) {
    return next(new AppError("You are not a member of this channel.", 403));
  }

  req.channel = channel;
  next();
});

module.exports = verifyChannelMember;

