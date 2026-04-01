const express = require('express');
const router = express.Router();

const authController = require('/AuthController');
const { validate } = require('/ResponseHandlerMiddleware');
const auth = require('/auth/CheckTokenMiddleware');
const checkExistingUser = require('/auth/CheckExistingUserMiddleware');
const verifyLogin = require('/auth/CheckLoginMiddleware');
const verifyEmailExists = require('/auth/CheckEmailExistsMiddleware');
const verifyResetToken = require('/auth/CheckResetTokenMiddleware');
const verifyAccountToken = require('/auth/CheckAccountTokenMiddleware');

const signupSchema = require('/Auth/SignupRequest');
const verifySchema = require('/Auth/VerifyRequest');
const loginSchema = require('/Auth/LoginRequest');
const forgetSchema = require('/Auth/ForgetRequest');
const resetSchema = require('/Auth/ResetRequest');

// Routes
router.post('/signup', validate(signupSchema), checkExistingUser, authController.signup);
router.post('/verify', validate(verifySchema), verifyAccountToken, authController.verify);
router.post('/login', validate(loginSchema), verifyLogin, authController.login);
router.post('/forget', validate(forgetSchema), verifyEmailExists, authController.forget);
router.post('/reset', validate(resetSchema), verifyResetToken, authController.reset);
router.post('/logout', auth, authController.logout);

module.exports = router;

