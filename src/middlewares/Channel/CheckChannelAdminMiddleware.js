<<<<<<< HEAD
const { asyncHandler } = require('../CheckValidationMiddleware');
const AppError = require('../../utils/AppError');
=======
﻿const { asyncHandler } = require('./CheckValidationMiddleware');
>>>>>>> 188e872936afc37377ce5e8a584d8a43059cf436

const channelAdmin = asyncHandler(async (req, res, next) => {
    const channel = req.channel;
    const user = req.user;

    if (!channel) {
        return next(new AppError('Channel not found.', 404));
    }

    if (!user) {
        return next(new AppError('Unauthorized.', 401));
    }

    const userId = String(user._id);
    const creatorId = String(channel.created_id);

    if (req.route && req.route.path === '/remove-member') {
        const targetUserId = String(req.validatedData?.user_id || '');
        if (targetUserId === userId) {
            return next();
        }
    }

    if (creatorId !== userId) {
        return next(new AppError('Access denied. Only the channel creator can perform this action.', 403));
    }

    next();
});

module.exports = channelAdmin;
