const { asyncHandler } = require('../CheckValidationMiddleware');

const channelRemoveMember = asyncHandler(async (req, res, next) => {
    const channel = req.channel;
    const data = req.validatedData;

    if (!channel) {
        return res.status(404).json({ message: 'Channel not found.' });
    }

    if (!data || !data.user_id) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    if (channel.type === 'direct') {
        return res.status(400).json({ message: 'Cannot remove members from a direct channel.' });
    }

    const targetUserId = String(data.user_id);
    const members = channel.members.map(member => ({
        ...member,
        user_id: String(member.user_id)
    }));

    if (!members.some(member => member.user_id === targetUserId)) {
        return res.status(404).json({ message: 'User is not a member of this channel.' });
    }

    if (String(channel.created_id) === targetUserId) {
        return res.status(403).json({ message: 'Cannot remove the channel creator.' });
    }

    req.members = members.filter(member => member.user_id !== targetUserId);
    next();
});

module.exports = channelRemoveMember;
