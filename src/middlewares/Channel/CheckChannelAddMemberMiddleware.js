const { asyncHandler } = require('../CheckValidationMiddleware');

const channelAddMember = asyncHandler(async (req, res, next) => {
    const channel = req.channel;
    const { user_id } = req.validatedData;

    if (channel.type === 'direct') {
        return res.status(400).json({ message: 'Cannot add members to a direct channel.' });
    }

    const isMember = channel.members.some(m => m.user_id === user_id);
    if (isMember) {
        return res.status(400).json({ message: 'User is already a member of this channel.' });
    }

    req.members = [...channel.members, { user_id, role: 'member' }];
    next();
});

module.exports = channelAddMember;
