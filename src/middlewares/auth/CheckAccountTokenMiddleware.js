const User = require('../../models/usermodel');
const { asyncHandler } = require('../responsehandlermiddleware');
const AppError = require('../../utils/apperror');

const verifyAccountToken = asyncHandler(async (req, res, next) => {
    const { token } = req.body;
    
    const user = await User.findOne({ verifyToken: token });

    if (!user) {
        return next(new AppError('Invalid verification token.', 400));
    }

    req.user = user;
    next();
});

module.exports = verifyAccountToken;

