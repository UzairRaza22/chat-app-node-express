const User = require('../../Models/UserModel');
const { asyncHandler } = require('../ResponseHandlerMiddleware');
const AppError = require('../../utils/AppError');

const checkExistingUser = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    if (email) {
        const user = await User.findOne({ email });
        if (user) {
            return next(new AppError('User already exists.', 400));
        }
    }
    next();
});

module.exports = checkExistingUser;

