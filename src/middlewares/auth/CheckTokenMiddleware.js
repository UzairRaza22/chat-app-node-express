const User = require('../../models/UserModel');
const Token = require('../../models/TokenModel');
const { asyncHandler } = require('../CheckValidationMiddleware');

const auth = asyncHandler(async (req, res, next) => {
    let token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({
            message: 'Access denied. No token provided.'
        });
    }

    token = token.replace('Bearer ', '');

    // Check if token exists in database
    const tokenDoc = await Token.findOne({ token });
    if (!tokenDoc) {
        return res.status(401).json({
            message: 'Invalid or expired token.'
        });
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) {
        return res.status(404).json({
            message: 'User not found.'
        });
    }
    
    req.user = user;
    next();
});

module.exports = auth;
