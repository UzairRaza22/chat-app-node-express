const Channel = require("../../Models/ChannelModel");
const { asyncHandler } = require("../CheckValidationMiddleware");
const AppError = require("../../utils/AppError");

const verifyChannelMember = asyncHandler(async (req, res, next) => {
  const { channelId } = req.validatedData;
  const userId = req.user._id;

  const channel = await Channel.findOne({
    _id: channelId,
    'members.user_id': String(userId),
  });

  if (!channel) {
    return next(new AppError("You are not a member of this channel.", 403));
  }

  req.channel = channel;
  next();
});

module.exports = verifyChannelMember;
