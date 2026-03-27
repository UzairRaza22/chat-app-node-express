const Workspace = require('../../models/Workspaces');
const { asyncHandler } = require('../CheckValidationMiddleware');

const checkWorkspaceMemberTeam = asyncHandler(async (req, res, next) => {
    const { members } = req.validatedData;

    const workspace = await Workspace.findById(req.team.workspace_id);

    if (!workspace) {
        return res.status(404).json({
            message: 'Workspace not found.'
        });
    }

    const workspaceMemberIds = workspace.members.map(m => m.toString());

    const invalidMembers = members.filter(memberId => !workspaceMemberIds.includes(memberId.toString()));

    if (invalidMembers.length > 0) {
        return res.status(400).json({
            message: 'One or more members are not part of the workspace.',
            invalid_members: invalidMembers
        });
    }

    next();
});

module.exports = checkWorkspaceMemberTeam;
