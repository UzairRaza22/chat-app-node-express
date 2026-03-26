const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user.model');
const { userResponse } = require('../resources/auth.resource');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const { asyncHandler } = require('../middlewares/validation.middleware');

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

    await transporter.sendMail({
        from: '"No Reply" <no-reply@nodeapp.com>',
        to: user.email,
        subject: 'Verify your account',
        html: `<p>Welcome, ${name}!</p>
               <p>Please use this token to verify your account:</p>
               <p><strong>${verifyToken}</strong></p>`
    });

    res.status(201).json({
        message: 'Account created successfully. Please check your email for the verification token.',
        user: userResponse(user)
    });
});

const verify = asyncHandler(async (req, res) => {
    const user = req.user;
    user.isVerified = true;
    user.verifyToken = null;
    await user.save();

    res.json({ message: 'Account verified successfully. You can now log in.' });
});

const login = asyncHandler(async (req, res) => {
    const user = req.user;

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json(userResponse(user, token));
});

const forget = asyncHandler(async (req, res) => {
    const user = req.user;

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    await transporter.sendMail({
        from: '"No Reply" <no-reply@nodeapp.com>',
        to: user.email,
        subject: 'Password Reset Request',
        html: `<p>You requested a password reset.</p>
               <p>Use this token to reset your password:</p>
               <p><strong>${resetToken}</strong></p>
               <p>This token expires in 1 hour.</p>`
    });

    res.json({ message: 'Password reset token sent to your email.' });
});

const reset = asyncHandler(async (req, res) => {
    const user = req.user;
    const { password } = req.validatedData;

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = null;
    user.resetTokenExpire = null;
    await user.save();

    res.json({ message: 'Password has been reset successfully.' });
});

const logout = asyncHandler(async (req, res) => {
    res.json({ message: 'Logged out successfully.' });
});

module.exports = { signup, verify, login, forget, reset, logout };
