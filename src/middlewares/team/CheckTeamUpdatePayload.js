const { asyncHandler } = require('../ResponseHandlerMiddleware');
const AppError = require('../../utils/AppError');

const checkTeamUpdatePayload = asyncHandler(async (req, res, next) => {
    const { name, description } = req.validatedData;
    const updatePayload = {};
    if (name !== undefined) updatePayload.name = name;
    if (description !== undefined) updatePayload.description = description;
    if (Object.keys(updatePayload).length === 0) {
        return next(new AppError('At least one field (name or description) must be provided for update.', 400));
    }

    req.updatePayload = updatePayload;
    next();
});

module.exports = checkTeamUpdatePayload;
