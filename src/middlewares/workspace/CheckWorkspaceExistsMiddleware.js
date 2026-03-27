const Workspace = require('../../Models/Workspaces');
const { asyncHandler } = require('../CheckValidationMiddleware');

/**
 * Finds a single workspace by req.params.id and attaches it to req.workspace.
 * Returns 404 if not found.
 */
const checkWorkspaceExists = asyncHandler(async (req, res, next) => {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
        return res.status(404).json({
            message: 'Workspace not found.'
        });
    }

    req.workspace = workspace;
    next();
});

module.exports = checkWorkspaceExists;
