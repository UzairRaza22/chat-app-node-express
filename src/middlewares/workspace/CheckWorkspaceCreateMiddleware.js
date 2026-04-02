const { asyncHandler } = require('../responsehandlermiddleware');
const AppError = require('../../utils/apperror');

/**
 * Checks that the authenticated user is the owner (creator) of the workspace.
 * Requires req.workspace (set by CheckWorkspaceExistsMiddleware) and req.user.
 */
const checkWorkspaceCreator = asyncHandler(async (req, res, next) => {
    if (req.workspace.ownerId.toString() !== req.user._id.toString()) {
<<<<<<< HEAD
        return next(new AppError('Access denied. Only the workspace owner can perform this action.', 403));
=======
        return res.error('Access denied. Only the workspace owner can perform this action.', 403);
>>>>>>> b89fd9a5ed63ea4e0854216ac6d27f5d043ecb5b
    }

    next();
});

module.exports = checkWorkspaceCreator;

