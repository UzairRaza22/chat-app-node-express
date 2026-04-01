const mongoose = require('mongoose');
const Channel = require('../../Models/ChannelModel');
const { asyncHandler } = require('../ResponseHandlerMiddleware');
const AppError = require('../../utils/AppError');


const channelExist = asyncHandler(async (req, res, next) => {
    const data = req.validatedData;

    if (!data) {
        return next(new AppError('Invalid request data.', 400));
    }

    const { channel_id, user_id } = data;

    if (channel_id) {
        if (!mongoose.Types.ObjectId.isValid(channel_id)) {
            return next(new AppError('Invalid channel ID format.', 400));
        }

        const channel = await Channel.findById(channel_id);
        if (!channel) {
            return next(new AppError('Channel not found.', 404));
        }

        req.channel = channel;
        return next();
    }

    if (user_id) {
        const normalizedUserId = String(user_id);
        const channels = await Channel.find({ 'members.user_id': normalizedUserId });
        req.channels = channels || [];
        return next();
    }

    return next(new AppError('channel_id or user_id is required.', 400));
});

module.exports = channelExist;

