const Workspace = require('../../Models/WorkspaceModel');
const { asyncHandler } = require('../CheckValidationMiddleware');
const AppError = require('../../utils/AppError'); 

const checkWorkspaceCreatorTeam = asyncHandler(async (req, res, next) => {
    const workspace = await Workspace.findById(req.team.workspace_id);

    if (!workspace) {
        return next(new AppError('Workspace not found.', 404));
    }

    if (workspace.ownerId.toString() !== req.user._id.toString()) {
        return next(new AppError('Access denied. Only the workspace owner can manage teams.', 403));
    }

    req.workspace = workspace;
    next();
});

module.exports = checkWorkspaceCreatorTeam;