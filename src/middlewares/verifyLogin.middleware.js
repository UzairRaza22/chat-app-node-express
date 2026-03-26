const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const verifyLogin = async (req, res, next) => {
    try {
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

        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({
            message: 'Server error during login validation',
            error: err.message
        });
    }
};

module.exports = verifyLogin;
