const Workspace = require('../../models/workspacemodel');
const { asyncHandler } = require('../Validate');
const AppError = require('../../utils/apperror');

const checkWorkspaceCreatorTeam = asyncHandler(async (req, res, next) => {
    const workspace = await Workspace.findById(req.team.workspace_id);
    if (!workspace) {
        return next(new AppError('Workspace not found.', 404));
    }

    if (String(workspace.creator_id) !== String(req.user._id)) {
        return next(new AppError('Access denied. Only the workspace creator can manage teams.', 403));
    }

    req.workspace = workspace;
    next();
});

module.exports = checkWorkspaceCreatorTeam;

