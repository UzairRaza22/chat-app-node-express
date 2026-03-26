const jwt = require('jsonwebtoken');
const User = require('../../models/UserModel');
const { asyncHandler } = require('../ValidationMiddleware');

const auth = asyncHandler(async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({
            message: 'Access denied. No token provided.'
        });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }
        
        req.user = user;
        next();
    } catch (ex) {
        return res.status(401).json({
            message: 'Invalid token.'
        });
    }
});

module.exports = auth;
