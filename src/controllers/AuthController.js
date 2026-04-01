const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('/UserModel');
const Token = require('/TokenModel');
const AuthResource = require('/AuthResource');
const { asyncHandler } = require('/ResponseHandlerMiddleware');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 */
const signup = asyncHandler(async (req, res) => {
    const { name, email, password } = req.validatedData;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verifyToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        verifyToken
    });

    res.success({
        message: 'Account created. Please check your email to verify your account.',
        user: AuthResource.make(user)
    }, 201);
});

/**
 * @desc    Verify user account
 * @route   POST /api/auth/verify
 */
const verify = asyncHandler(async (req, res) => {
    const user = req.user;

    user.isVerified = true;
    user.verifyToken = null;
    await user.save();

    res.success({ message: 'Account verified successfully. You can now log in.' });
});

/**
 * @desc    Login user & get custom token
 * @route   POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
    const user = req.user;
    const accessToken = crypto.randomBytes(32).toString('hex');

    await Token.create({
        userId: user._id,
        token: accessToken
    });

    res.success(AuthResource.withToken(user, accessToken));
});

/**
 * @desc    Forgot password - send reset token
 * @route   POST /api/auth/forget
 */
const forget = asyncHandler(async (req, res) => {
    const user = req.user;

    user.resetToken = crypto.randomBytes(32).toString('hex');
    user.resetTokenExpire = Date.now() + 3600000;
    
    // Flag to trigger the post-save email since findOne users don't have isModified easily in post-save sometimes
    user._resetTokenChanged = true;
    await user.save();

    res.success({ message: 'Password reset token sent to your email.' });
});

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset
 */
const reset = asyncHandler(async (req, res) => {
    const user = req.user;
    const { password } = req.validatedData;

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = null;
    user.resetTokenExpire = null;
    await user.save();

    res.success({ message: 'Password has been reset successfully.' });
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    await Token.findOneAndDelete({ token });

    res.success({ message: 'Logged out successfully.' });
});

module.exports = {
    signup,
    verify,
    login,
    forget,
    reset,
    logout
};

