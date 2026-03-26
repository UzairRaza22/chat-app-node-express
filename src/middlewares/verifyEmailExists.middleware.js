const User = require('../models/user.model');

const verifyEmailExists = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: 'User with this email does not exist.'
            });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({
            message: 'Server error during email lookup',
            error: err.message
        });
    }
};

module.exports = verifyEmailExists;
