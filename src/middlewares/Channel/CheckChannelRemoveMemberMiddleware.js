const { asyncHandler } = require('../CheckValidationMiddleware');

const channelRemoveMember = asyncHandler(async (req, res, next) => {
    const channel = req.channel;
    const { user_id } = req.validatedData;

    if (channel.type === 'direct') {
        return res.status(400).json({ message: 'Cannot remove members from a direct channel.' });
    }

    const isMember = channel.members.some(m => m.user_id === user_id);
    if (!isMember) {
        return res.status(400).json({ message: 'User is not a member of this channel.' });
    }

    req.members = channel.members.filter(m => m.user_id !== user_id);
    next();
});

module.exports = channelRemoveMember;
