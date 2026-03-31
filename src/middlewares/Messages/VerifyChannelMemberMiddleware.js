// const Channel = require("../../models/ChannelModel");
// const { asyncHandler } = require("./ValidationMiddleware");

// const verifyChannelMember = asyncHandler(async (req, res, next) => {
//   const { channelId } = req.validatedData;
//   const userId = req.user._id;

//   const channel = await Channel.findOne({
//     _id: channelId,
//     "members.user_id": userId,
//   });

//   if (!channel) {
//     return res.status(403).json({
//       message: "You are not a member of this channel.",
//     });
//   }

//   req.channel = channel;
//   next();
// });

// module.exports = verifyChannelMember;

const Channel = require("../../models/ChannelModel");
const { asyncHandler } = require("./ValidationMiddleware");

/**
 * members is an array of objects: [{ user_id, role, _id }, ...]
 * So we query using "members.user_id" to match against the nested field.
 */
const verifyChannelMember = asyncHandler(async (req, res, next) => {
  const { channelId } = req.validatedData;
  const userId = req.user._id;

  const channel = await Channel.findOne({
    _id: channelId,
    "members.user_id": userId,
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
