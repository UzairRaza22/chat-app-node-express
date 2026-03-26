const express = require('express');
const router = express.Router();

const authController = require('../controllers/AuthController');
const { validate } = require('../middlewares/ValidationMiddleware');
const auth = require('../middlewares/auth/AuthMiddleware');
const checkExistingUser = require('../middlewares/auth/CheckExistingUserMiddleware');
const verifyLogin = require('../middlewares/auth/VerifyLoginMiddleware');
const verifyEmailExists = require('../middlewares/auth/VerifyEmailExistsMiddleware');
const verifyResetToken = require('../middlewares/auth/VerifyResetTokenMiddleware');
const verifyAccountToken = require('../middlewares/auth/VerifyAccountTokenMiddleware');

const signupSchema = require('../requests/auth/SignupRequest');
const verifySchema = require('../requests/auth/VerifyRequest');
const loginSchema = require('../requests/auth/LoginRequest');
const forgetSchema = require('../requests/auth/ForgetRequest');
const resetSchema = require('../requests/auth/ResetRequest');

router.post('/signup', validate(signupSchema), checkExistingUser, authController.signup);
router.post('/verify', validate(verifySchema), verifyAccountToken, authController.verify);
router.post('/login', validate(loginSchema), verifyLogin, authController.login);
router.post('/forget', validate(forgetSchema), verifyEmailExists, authController.forget);
router.post('/reset', validate(resetSchema), verifyResetToken, authController.reset);
router.post('/logout', auth, authController.logout);

module.exports = router;
