const express = require('express');
const router = express.Router();

const authController = require('../controllers/AuthController');
const { validate } = require('../middlewares/ResponseHandlerMiddleware');
const auth = require('../middlewares/auth/CheckTokenMiddleware');
const checkExistingUser = require('../middlewares/auth/CheckExistingUserMiddleware');
const verifyLogin = require('../middlewares/auth/CheckLoginMiddleware');
const verifyEmailExists = require('../middlewares/auth/CheckEmailExistsMiddleware');
const verifyResetToken = require('../middlewares/auth/CheckResetTokenMiddleware');
const verifyAccountToken = require('../middlewares/auth/CheckAccountTokenMiddleware');

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

