const Workspace = require('../../Models/WorkspaceModel');
const { asyncHandler } = require('../CheckValidationMiddleware');

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
        return res.error('A workspace with this name already exists.');
    }

    next();
});

module.exports = checkUniqueWorkspace;
