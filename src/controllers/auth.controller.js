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

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.validatedData;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashedPassword });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json(userResponse(user, token));
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const verify = async (req, res) => {
    try {
        const user = req.user;
        user.isVerified = true;
        await user.save();

        res.json(userResponse(user));
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const user = req.user;

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json(userResponse(user, token));
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const forget = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const reset = async (req, res) => {
    try {
        const user = req.user;
        const { password } = req.validatedData;

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetToken = null;
        user.resetTokenExpire = null;
        await user.save();

        res.json({ message: 'Password has been reset successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const logout = async (req, res) => {
    try {
        // In a stateless JWT architecture, logout is primarily handled by the client 
        // deleting the token from their storage (localStorage/cookies).
        // This endpoint acts as a successful confirmation hook for the frontend.
        res.json({ message: 'Logged out successfully. Please remove the token from the client.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { signup, verify, login, forget, reset, logout };
