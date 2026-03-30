const Workspace = require('../../Models/WorkspaceModel');
const { asyncHandler } = require('../CheckValidationMiddleware');

const checkWorkspaceCreatorTeam = asyncHandler(async (req, res, next) => {
    const workspace = await Workspace.findById(req.team.workspace_id);

    if (!workspace) {
        return res.status(404).json({
            message: 'Workspace not found.'
        });
    }

    if (workspace.ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            message: 'Access denied. Only the workspace owner can manage teams.'
        });
    }

    req.workspace = workspace;
    next();
});

module.exports = checkWorkspaceCreatorTeam;
