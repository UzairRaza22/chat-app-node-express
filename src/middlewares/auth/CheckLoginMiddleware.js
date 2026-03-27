const bcrypt = require('bcryptjs');
const User = require('../../Models/UserModel');
const { asyncHandler } = require('../CheckValidationMiddleware');

const verifyLogin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            message: 'Invalid credentials.'
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({
            message: 'Invalid credentials.'
        });
    }

    if (!user.isVerified) {
        return res.status(403).json({
            message: 'Please verify your email address before logging in.'
        });
    }

    req.user = user;
    next();
});

module.exports = verifyLogin;
