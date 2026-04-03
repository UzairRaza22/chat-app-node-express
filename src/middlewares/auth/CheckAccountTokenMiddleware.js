const User = require('../../models/UserModel');
const { asyncHandler } = require('../Validate');
const AppError = require('../../utils/AppError');

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


