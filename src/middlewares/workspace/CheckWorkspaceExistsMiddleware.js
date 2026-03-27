const Workspace = require('../../Models/Workspaces');
const { asyncHandler } = require('../CheckValidationMiddleware');

/**
 * Finds a single workspace by req.body.workspace_id and attaches it to req.workspace.
 * Returns 404 if not found.
 */
const checkWorkspaceExists = asyncHandler(async (req, res, next) => {
    const id = req.body.workspace_id;
    
    if (!id) {
        return res.status(400).json({
            message: 'workspace_id is required in the request body.'
        });
    }

    const workspace = await Workspace.findById(id);

    if (!workspace) {
        return res.status(404).json({
            message: 'Workspace not found.'
        });
    }

    req.workspace = workspace;
    next();
});

module.exports = checkWorkspaceExists;
