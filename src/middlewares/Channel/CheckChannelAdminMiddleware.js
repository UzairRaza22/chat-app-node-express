const { asyncHandler } = require('../CheckValidationMiddleware');

const channelAdmin = asyncHandler(async (req, res, next) => {
    const channel = req.channel;
    const user = req.user;

    if (!channel) {
        return res.status(404).json({ message: 'Channel not found.' });
    }

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized.' });
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
        return res.status(403).json({ message: 'Access denied. Only the channel creator can perform this action.' });
    }

    next();
});

module.exports = channelAdmin;
