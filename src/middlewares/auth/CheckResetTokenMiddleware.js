const User = require('../../Models/UserModel');
const { asyncHandler } = require('../CheckValidationMiddleware');

const verifyResetToken = asyncHandler(async (req, res, next) => {
    const { token } = req.body;
    
    const user = await User.findOne({ 
        resetToken: token,
        resetTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({
            message: 'Invalid or expired reset token.'
        });
    }

    req.user = user;
    next();
});

module.exports = verifyResetToken;
