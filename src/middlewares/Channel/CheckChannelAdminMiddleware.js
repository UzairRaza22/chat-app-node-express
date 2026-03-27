const { asyncHandler } = require('../CheckValidationMiddleware');

const channelAdmin = asyncHandler(async (req, res, next) => {
    const channel = req.channel;
    const user = req.user;

    // Exception: allow self-removal in remove-member route
    if (req.route && req.route.path === '/remove-member') {
        const { user_id } = req.validatedData || req.body;
        if (user_id === user._id.toString()) {
            return next();
        }
    }

    if (channel.created_id !== user._id.toString()) {
        return res.status(403).json({ message: 'Access denied. Only the channel admin can perform this action.' });
    }

    next();
});

module.exports = channelAdmin;
