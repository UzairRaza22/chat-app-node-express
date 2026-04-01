const Workspace = require('../../Models/WorkspaceModel');
const { asyncHandler } = require('../CheckValidationMiddleware');
const AppError = require('../../utils/AppError');

/**
 * Finds a single workspace by req.body.workspace_id and attaches it to req.workspace.
 * Returns 404 if not found.
 */
const checkWorkspaceExists = asyncHandler(async (req, res, next) => {
    const id = req.body.workspace_id;
    
    if (!id) {
        return res.error('workspace_id is required in the request body.', 400);
    }

    const workspace = await Workspace.findById(id);

    if (!workspace) {
        return res.error('Workspace not found.', 404);
    }

    req.workspace = workspace;
    next();
});

module.exports = checkWorkspaceExists;
