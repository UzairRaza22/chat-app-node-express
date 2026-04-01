const Workspace = require('../../Models/WorkspaceModel');
const Team = require('../../Models/TeamModel');
const { asyncHandler } = require('./CheckValidationMiddleware');

const memberCheck = asyncHandler(async (req, res, next) => {
    const user = req.user;
    const data = req.validatedData;

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized.' });
    }

    if (!data) {
        return res.status(400).json({ message: 'Invalid request data.' });
    }

    const { workspace_id, team_id, type } = data;
    if (!workspace_id) {
        return res.status(400).json({ message: 'workspace_id is required.' });
    }

    const workspace = await Workspace.findById(workspace_id);
    if (!workspace) {
        return res.status(404).json({ message: 'Workspace not found.' });
    }

    const userId = String(user._id);
    const workspaceMemberIds = workspace.members.map(member => String(member));
    if (!workspaceMemberIds.includes(userId)) {
        return res.status(403).json({ message: 'User is not part of this workspace.' });
    }

    req.workspace = workspace;

    if (type === 'direct') {
        return next();
    }

    if (!team_id) {
        return res.status(400).json({ message: 'team_id is required for public or private channels.' });
    }

    const team = await Team.findById(team_id);
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

    req.team = team;
    next();
});

module.exports = memberCheck;
