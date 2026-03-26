const User = require('../models/user.model');

const verifyResetToken = async (req, res, next) => {
    try {
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
    } catch (err) {
        res.status(500).json({
            message: 'Server error during token validation',
            error: err.message
        });
    }
};

module.exports = verifyResetToken;
