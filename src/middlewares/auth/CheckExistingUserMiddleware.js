const User = require('../../Models/UserModel');
const { asyncHandler } = require('../CheckValidationMiddleware');

const checkExistingUser = asyncHandler(async (req, res, next) => {
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
});

module.exports = checkExistingUser;
