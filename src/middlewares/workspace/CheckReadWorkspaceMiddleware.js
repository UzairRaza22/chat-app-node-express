const Workspace = require('../../models/workspacemodel');
const WorkspaceResource = require('../../resources/workspaceresource');
const { asyncHandler } = require('../responsehandlermiddleware');
const AppError = require('../../utils/apperror');

/**
 * Checks if workspace_id is in body. 
 * If yes, finds the single workspace and formats response.
 * If no, finds all user workspaces and formats response.
 */
const checkReadWorkspace = asyncHandler(async (req, res, next) => {
    if (req.body.workspace_id) {
        const workspace = await Workspace.findById(req.body.workspace_id);
        if (!workspace) {
            return next(new AppError('Workspace not found.', 404));
        }
        req.responseData = {
            message: 'Workspace retrieved successfully.',
            data: WorkspaceResource.make(workspace)
        };
    } else {
        const workspaces = await Workspace.find({ members: req.user._id });
        req.responseData = {
            message: 'Workspaces retrieved successfully.',
            data: WorkspaceResource.collection(workspaces)
        };
    }
    next();
});

module.exports = checkReadWorkspace;

