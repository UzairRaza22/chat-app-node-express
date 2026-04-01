const Workspace = require('../../Models/WorkspaceModel');
const { asyncHandler } = require('../ResponseHandlerMiddleware');
const AppError = require('../../utils/AppError');

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
