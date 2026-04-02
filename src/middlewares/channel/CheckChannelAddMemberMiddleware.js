const Workspace = require('../../models/workspacemodel');
const Team = require('../../models/teammodel');
const { asyncHandler } = require('../Validate');
const AppError = require('../../utils/apperror');


const channelAddMember = asyncHandler(async (req, res, next) => {
    const channel = req.channel;
    const user = req.user;
    const data = req.validatedData;


    if (channel.type === 'direct') {
        return next(new AppError('Cannot add members to a direct channel.', 400));
    }

    const userId = String(user._id);
    const targetUserId = String(data.user_id);
    const creatorId = String(channel.created_id);
    const existingMemberIds = channel.members.map(member => String(member.user_id));

    if (creatorId === targetUserId) {
        return next(new AppError('Creator is already part of the channel.', 400));
    }

    if (existingMemberIds.includes(targetUserId)) {
        return next(new AppError('User is already a member of this channel.', 400));
    }

    // Workspace membership must hold for both the requesting user and the target user
    const workspace = await Workspace.findById(channel.workspace_id);
    if (!workspace) {
        return next(new AppError('Workspace not found.', 404));
    }

    const workspaceMemberIds = workspace.members.map(member => String(member));
    if (!workspaceMemberIds.includes(userId) || !workspaceMemberIds.includes(targetUserId)) {
        return next(new AppError('User is not part of this workspace.', 403));
    }

    // For public/private channels, target user must also be on the channel team
    if (['public', 'private'].includes(channel.type)) {
        const team = await Team.findById(channel.team_id);
        if (!team) {
            return next(new AppError('Team not found.', 404));
        }

        const teamMemberIds = team.members.map(member => String(member));
        if (!teamMemberIds.includes(userId) || !teamMemberIds.includes(targetUserId)) {
            return next(new AppError('User is not part of this team.', 403));
        }
    }

    req.members = [
        ...channel.members,
        { user_id: targetUserId, role: 'member' }
    ];

    next();
});

module.exports = channelAddMember;


