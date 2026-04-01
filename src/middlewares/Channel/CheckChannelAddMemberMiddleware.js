const Workspace = require('../../Models/WorkspaceModel');
const Team = require('../../Models/TeamModel');
const { asyncHandler } = require('./CheckValidationMiddleware');

const channelAddMember = asyncHandler(async (req, res, next) => {
    const channel = req.channel;
    const user = req.user;
    const data = req.validatedData;

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized.' });
    }

    if (!channel) {
        return res.status(404).json({ message: 'Channel not found.' });
    }

    if (!data || !data.user_id) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    if (channel.type === 'direct') {
        return res.status(400).json({ message: 'Cannot add members to a direct channel.' });
    }

    const userId = String(user._id);
    const targetUserId = String(data.user_id);
    const creatorId = String(channel.created_id);
    const existingMemberIds = channel.members.map(member => String(member.user_id));

    if (creatorId === targetUserId) {
        return res.status(400).json({ message: 'Creator is already part of the channel.' });
    }

    if (existingMemberIds.includes(targetUserId)) {
        return res.status(400).json({ message: 'User is already a member of this channel.' });
    }

    // Workspace membership must hold for both the requesting user and the target user
    const workspace = await Workspace.findById(channel.workspace_id);
    if (!workspace) {
        return res.status(404).json({ message: 'Workspace not found.' });
    }

    const workspaceMemberIds = workspace.members.map(member => String(member));
    if (!workspaceMemberIds.includes(userId) || !workspaceMemberIds.includes(targetUserId)) {
        return res.status(403).json({ message: 'User is not part of this workspace.' });
    }

    // For public/private channels, target user must also be on the channel team
    if (['public', 'private'].includes(channel.type)) {
        const team = await Team.findById(channel.team_id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found.' });
        }

        const teamMemberIds = team.members.map(member => String(member));
        if (!teamMemberIds.includes(userId) || !teamMemberIds.includes(targetUserId)) {
            return res.status(403).json({ message: 'User is not part of this team.' });
        }
    }

    req.members = [
        ...channel.members,
        { user_id: targetUserId, role: 'member' }
    ];

    next();
});

module.exports = channelAddMember;
