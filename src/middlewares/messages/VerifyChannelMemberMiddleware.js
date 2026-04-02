const Channel = require("../../Models/ChannelModel");
const { asyncHandler } = require("../Validate");

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
