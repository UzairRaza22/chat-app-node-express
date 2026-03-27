const Channel = require("../../models/channel.model");
const { asyncHandler } = require("../validation.middleware");

const verifyChannelMember = asyncHandler(async (req, res, next) => {
  const { channelId } = req.validatedData;
  const userId = req.user._id;

  const channel = await Channel.findOne({
    _id: channelId,
    members: userId,
  });

  if (!channel) {
    return res.status(403).json({
      message: "You are not a member of this channel.",
    });
  }

  req.channel = channel;
  next();
});

module.exports = verifyChannelMember;
