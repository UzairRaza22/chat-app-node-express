const express = require('express');
const router = express.Router();

const authController = require('../Controllers/AuthController');
const { validate } = require('../Middlewares/CheckValidationMiddleware');
const auth = require('../Middlewares/Auth/CheckTokenMiddleware');
const checkExistingUser = require('../Middlewares/Auth/CheckExistingUserMiddleware');
const verifyLogin = require('../Middlewares/Auth/CheckLoginMiddleware');
const verifyEmailExists = require('../Middlewares/Auth/CheckEmailExistsMiddleware');
const verifyResetToken = require('../Middlewares/Auth/CheckResetTokenMiddleware');
const verifyAccountToken = require('../Middlewares/Auth/CheckAccountTokenMiddleware');

const signupSchema = require('../Requests/Auth/SignupRequest');
const verifySchema = require('../Requests/Auth/VerifyRequest');
const loginSchema = require('../Requests/Auth/LoginRequest');
const forgetSchema = require('../Requests/Auth/ForgetRequest');
const resetSchema = require('../Requests/Auth/ResetRequest');

// Routes
router.post('/signup', validate(signupSchema), checkExistingUser, authController.signup);
router.post('/verify', validate(verifySchema), verifyAccountToken, authController.verify);
router.post('/login', validate(loginSchema), verifyLogin, authController.login);
router.post('/forget', validate(forgetSchema), verifyEmailExists, authController.forget);
router.post('/reset', validate(resetSchema), verifyResetToken, authController.reset);
router.post('/logout', auth, authController.logout);

module.exports = router;
