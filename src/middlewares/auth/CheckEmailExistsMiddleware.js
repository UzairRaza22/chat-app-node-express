const User = require('../../models/usermodel');
const { asyncHandler } = require('../responsehandlermiddleware');
const AppError = require('../../utils/apperror');

const verifyEmailExists = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
        return next(new AppError('User with this email does not exist.', 404));
    }

    req.user = user;
    next();
});

module.exports = verifyEmailExists;

