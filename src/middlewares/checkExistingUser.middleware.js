const User = require('../models/user.model');

const checkExistingUser = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (email) {
            const user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({
                    message: 'User already exists.'
                });
            }
        }
        next();
    } catch (err) {
        res.status(500).json({
            message: 'Server error during validation',
            error: err.message
        });
    }
};

module.exports = checkExistingUser;
