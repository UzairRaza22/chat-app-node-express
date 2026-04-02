const Workspace = require('../../models/workspacemodel');
const { asyncHandler } = require('../responsehandlermiddleware');
const AppError = require('../../utils/apperror');

/**
 * Checks that no workspace with the same name already exists.
 * Reads name from req.validatedData (after Joi validation has run).
 */
const checkUniqueWorkspace = asyncHandler(async (req, res, next) => {
    const { name } = req.validatedData;

    if (!name) {
        return next();
    }

    const existing = await Workspace.findOne({ name });

    if (existing) {
<<<<<<< HEAD
        return next(new AppError('A workspace with this name already exists.', 400));
=======
        return res.error('A workspace with this name already exists.');
>>>>>>> b89fd9a5ed63ea4e0854216ac6d27f5d043ecb5b
    }

    next();
});

module.exports = checkUniqueWorkspace;

