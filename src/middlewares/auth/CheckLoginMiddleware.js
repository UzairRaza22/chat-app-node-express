const bcrypt = require('bcryptjs');
const User = require('../../models/usermodel');
const { asyncHandler } = require('../Validate');
const AppError = require('../../utils/apperror');

const verifyLogin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
        return next(new AppError('Invalid credentials.', 400));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return next(new AppError('Invalid credentials.', 400));
    }

    if (!user.isVerified) {
        return next(new AppError('Please verify your email address before logging in.', 403));
    }

    req.user = user;
    next();
});

module.exports = verifyLogin;


