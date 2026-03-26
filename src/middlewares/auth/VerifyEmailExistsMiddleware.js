const User = require('../../models/UserModel');
const { asyncHandler } = require('../ValidationMiddleware');

const verifyEmailExists = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            message: 'User with this email does not exist.'
        });
    }

    req.user = user;
    next();
});

module.exports = verifyEmailExists;
