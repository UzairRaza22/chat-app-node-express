const Channel = require('../../models/ChannelModel');
const { asyncHandler } = require('../CheckValidationMiddleware');

const channelCreate = asyncHandler(async (req, res, next) => {
    const { name, workspace_id, team_id, type, direct_user_id } = req.validatedData;
    const user = req.user;

    let direct_id = null;
    let members = [{ user_id: user._id.toString(), role: 'admin' }];

    if (type === 'direct') {
        if (!direct_user_id) {
            return res.status(400).json({ message: 'direct_user_id is required for direct channels.' });
        }
        if (direct_user_id === user._id.toString()) {
            return res.status(400).json({ message: 'Cannot create a direct channel with yourself.' });
        }

        const sortedIds = [user._id.toString(), direct_user_id].sort();
        direct_id = `${sortedIds[0]}_${sortedIds[1]}`;

        const existing = await Channel.findOne({ type: 'direct', direct_id });
        if (existing) {
            return res.status(400).json({ message: 'Direct channel already exists between these users.' });
        }

        members.push({ user_id: direct_user_id, role: 'member' });
    } else {
        if (!team_id) {
            return res.status(400).json({ message: 'team_id is required for public or private channels.' });
        }
    }

    req.channelData = {
        name: type === 'direct' ? null : name,
        workspace_id,
        team_id: type === 'direct' ? null : team_id,
        type,
        created_id: user._id.toString(),
        members,
        direct_id
    };

    next();
});

module.exports = channelCreate;
