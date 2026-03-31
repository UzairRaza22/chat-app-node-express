const Channel = require('../../Models/ChannelModel');
const Workspace = require('../../Models/WorkspaceModel');
const Team = require('../../Models/TeamModel');
const { asyncHandler } = require('../CheckValidationMiddleware');

const channelCreate = asyncHandler(async (req, res, next) => {
    const data = req.validatedData;
    const user = req.user;

    // Ensure request is authenticated
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized.' });
    }

    // Joi already validated payload shape, but guard missing data
    if (!data) {
        return res.status(400).json({ message: 'Invalid request data.' });
    }

    const { name, workspace_id, team_id, type, direct_user_id } = data;
    const userId = String(user._id);

    // Channel type must be one of the supported values
    if (!['public', 'private', 'direct'].includes(type)) {
        return res.status(400).json({ message: 'Invalid channel type.' });
    }

    // Workspace membership is required for all channel creation flows
    if (!workspace_id) {
        return res.status(400).json({ message: 'workspace_id is required.' });
    }

    const workspace = req.workspace || await Workspace.findById(workspace_id);
    if (!workspace) {
        return res.status(404).json({ message: 'Workspace not found.' });
    }

    const workspaceMemberIds = workspace.members.map(member => String(member));
    if (!workspaceMemberIds.includes(userId)) {
        return res.status(403).json({ message: 'User is not part of this workspace.' });
    }

    // Public/private channels require team membership as well
    let team = req.team;
    if (type !== 'direct') {
        if (!team_id) {
            return res.status(400).json({ message: 'team_id is required for public or private channels.' });
        }

        team = team || await Team.findById(team_id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found.' });
        }

        if (String(team.workspace_id) !== String(workspace._id)) {
            return res.status(400).json({ message: 'Team does not belong to this workspace.' });
        }

        const teamMemberIds = team.members.map(member => String(member));
        if (!teamMemberIds.includes(userId)) {
            return res.status(403).json({ message: 'User is not part of this team.' });
        }

        if (!name || name.trim().length < 3) {
            return res.status(400).json({ message: 'Channel name must be at least 3 characters.' });
        }

        // Enforce unique name inside workspace + team for public/private channels
        const existing = await Channel.findOne({
            name,
            workspace_id,
            team_id,
            type
        });

        if (existing) {
            return res.status(409).json({ message: 'Channel with this name already exists.' });
        }
    }

    const members = [{ user_id: userId, role: 'creator' }];
    let direct_id = null;

    if (type === 'direct') {
        if (team_id) {
            return res.status(400).json({ message: 'team_id is not allowed for direct channels.' });
        }

        if (!direct_user_id) {
            return res.status(400).json({ message: 'direct_user_id is required for direct channels.' });
        }

        const directUserId = String(direct_user_id);
        if (directUserId === userId) {
            return res.status(400).json({ message: 'Cannot create a direct channel with yourself.' });
        }

        if (!workspaceMemberIds.includes(directUserId)) {
            return res.status(403).json({ message: 'User is not part of this workspace.' });
        }

        const sortedIds = [userId, directUserId].sort();
        direct_id = `${sortedIds[0]}_${sortedIds[1]}`;

        const existing = await Channel.findOne({
            type: 'direct',
            workspace_id,
            direct_id
        });

        if (existing) {
            return res.status(409).json({ message: 'Direct channel already exists between these users.' });
        }

        members.push({ user_id: directUserId, role: 'member' });
    }

    req.channelData = {
        name: type === 'direct' ? null : name,
        workspace_id,
        team_id: type === 'direct' ? null : team_id,
        type,
        created_id: userId,
        members,
        direct_id
    };

    next();
});

module.exports = channelCreate;
