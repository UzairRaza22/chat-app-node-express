const User = require('../../Models/UserModel');
const { asyncHandler } = require('../ResponseHandlerMiddleware');
const AppError = require('../../utils/AppError');

/**
 * Checks that all provided member IDs exist as valid users.
 * Expects req.validatedData.members to be an array of user IDs.
 */
const checkMembersExist = asyncHandler(async (req, res, next) => {
    const { members } = req.validatedData;

    const users = await User.find({ _id: { $in: members } });

    if (users.length !== members.length) {
        return next(new AppError('One or more member user IDs do not exist.', 400));
    }

    next();
});

module.exports = checkMembersExist;

