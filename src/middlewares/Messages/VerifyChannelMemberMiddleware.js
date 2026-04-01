const Channel = require("../../models/ChannelModel");
const { asyncHandler } = require("./ValidationMiddleware");

/**
 * Verifies the logged-in user is a member of the channel.
 * members is an array of objects: [{ user_id, role, _id }, ...]
 * Uses "members.user_id" dot notation to match the nested field.
 *
 * On failure → passes 403 error to ErrorHandlerMiddleware via next(err).
 */
const verifyChannelMember = asyncHandler(async (req, res, next) => {
  const { channelId } = req.validatedData;
  const userId = req.user._id;

  const channel = await Channel.findOne({
    _id: channelId,
    "members.user_id": userId,
  });

  if (!channel) {
    const err = new Error("You are not a member of this channel.");
    err.statusCode = 403;
    return next(err);
  }

  req.channel = channel;
  next();
});

module.exports = verifyChannelMember;
