const Workspace = require('../../models/workspacemodel');
const { asyncHandler } = require('../Validate');
const AppError = require('../../utils/apperror');

const checkWorkspaceMemberTeam = asyncHandler(async (req, res, next) => {
    const { members } = req.validatedData;

    const workspace = await Workspace.findById(req.team.workspace_id);
    if (!workspace) {
        return next(new AppError('Workspace not found.', 404));
    }

    const workspaceMemberIds = workspace.members.map(member => String(member));
    const invalidMembers = members.filter(memberId => !workspaceMemberIds.includes(String(memberId)));
    if (invalidMembers.length > 0) {
        return next(new AppError('One or more members are not part of the workspace.', 400));
    }

    next();
});

module.exports = checkWorkspaceMemberTeam;

