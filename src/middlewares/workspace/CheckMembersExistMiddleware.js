const User = require('../../Models/UserModel');
const { asyncHandler } = require('../CheckValidationMiddleware');

/**
 * Checks that all provided member IDs exist as valid users.
 * Expects req.validatedData.members to be an array of user IDs.
 */
const checkMembersExist = asyncHandler(async (req, res, next) => {
    const { members } = req.validatedData;

    const users = await User.find({ _id: { $in: members } });

    if (users.length !== members.length) {
        return res.status(400).json({
            message: 'One or more member user IDs do not exist.'
        });
    }

    next();
});

module.exports = checkMembersExist;
