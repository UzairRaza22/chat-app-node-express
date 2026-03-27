const User = require('../../models/UserModel');
const { asyncHandler } = require('../CheckValidationMiddleware');

const verifyAccountToken = asyncHandler(async (req, res, next) => {
    const { token } = req.body;
    
    const user = await User.findOne({ verifyToken: token });

    if (!user) {
        return res.status(400).json({
            message: 'Invalid verification token.'
        });
    }

    req.user = user;
    next();
});

module.exports = verifyAccountToken;
