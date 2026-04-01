const User = require('../../models/usermodel');
const { asyncHandler } = require('../responsehandlermiddleware');
const AppError = require('../../utils/apperror');

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

