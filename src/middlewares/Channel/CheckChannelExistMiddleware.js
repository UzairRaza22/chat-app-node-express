const Channel = require('../../models/ChannelModel');
const { asyncHandler } = require('../CheckValidationMiddleware');

const channelExist = asyncHandler(async (req, res, next) => {
    const { channel_id, user_id } = req.validatedData || req.body;

    if (channel_id) {
        const channel = await Channel.findById(channel_id);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found.' });
        }
        req.channel = channel;
    } else if (user_id) {
        const channels = await Channel.find({ 'members.user_id': user_id });
        if (!channels || channels.length === 0) {
            return res.status(404).json({ message: 'No channels found for this user.' });
        }
        req.channels = channels;
    } else {
        return res.status(400).json({ message: 'Valid channel_id or user_id is required.' });
    }

    next();
});

module.exports = channelExist;
