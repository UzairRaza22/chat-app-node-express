const { asyncHandler } = require('../CheckValidationMiddleware');

/**
 * Checks that the authenticated user is the owner (creator) of the workspace.
 * Requires req.workspace (set by CheckWorkspaceExistsMiddleware) and req.user.
 */
const checkWorkspaceCreator = asyncHandler(async (req, res, next) => {
    if (req.workspace.ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            message: 'Access denied. Only the workspace owner can perform this action.'
        });
    }

    next();
});

module.exports = checkWorkspaceCreator;
