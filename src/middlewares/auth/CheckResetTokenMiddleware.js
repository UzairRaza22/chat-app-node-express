const User = require('../../Models/UserModel');
const { asyncHandler } = require('../ResponseHandlerMiddleware');
const AppError = require('../../utils/AppError');

const verifyResetToken = asyncHandler(async (req, res, next) => {
    const { token } = req.body;
    
    const user = await User.findOne({ 
        resetToken: token,
        resetTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new AppError('Invalid or expired reset token.', 400));
    }

    req.user = user;
    next();
});

module.exports = verifyResetToken;

