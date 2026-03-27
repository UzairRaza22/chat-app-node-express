const { asyncHandler } = require('../CheckValidationMiddleware');

const checkTeamUpdatePayload = asyncHandler(async (req, res, next) => {
    const { name, description } = req.validatedData;

    const updatePayload = {};

    if (name !== undefined) updatePayload.name = name;
    if (description !== undefined) updatePayload.description = description;

    if (Object.keys(updatePayload).length === 0) {
        return res.status(400).json({
            message: 'At least one field (name or description) must be provided for update.'
        });
    }

    req.updatePayload = updatePayload;
    next();
});

module.exports = checkTeamUpdatePayload;
