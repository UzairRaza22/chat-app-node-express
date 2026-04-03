const User = require('../../models/UserModel');
const Token = require('../../models/TokenModel');
const { asyncHandler } = require('../Validate');
const AppError = require('../../utils/AppError');

const auth = asyncHandler(async (req, res, next) => {
    let token = req.header('Authorization');

    if (!token) {
        return next(new AppError('Access denied. No token provided.', 401));
    }

    token = token.replace('Bearer ', '');

    // Check if token exists in database
    const tokenDoc = await Token.findOne({ token });
    if (!tokenDoc) {
        return next(new AppError('Invalid or expired token.', 401));
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) {
        return next(new AppError('User not found.', 404));
    }

    // Ensure user is verified
    if (!user.isVerified) {
        return next(new AppError('Account not verified. Please verify your email.', 403));
    }
    
    req.user = user;
    next();
});

module.exports = auth;


