const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validation.middleware');
const auth = require('../middlewares/auth.middleware');
const checkExistingUser = require('../middlewares/checkExistingUser.middleware');
const verifyLogin = require('../middlewares/verifyLogin.middleware');
const verifyEmailExists = require('../middlewares/verifyEmailExists.middleware');
const verifyResetToken = require('../middlewares/verifyResetToken.middleware');

const signupSchema = require('../requests/auth/signup.request');
const verifySchema = require('../requests/auth/verify.request');
const loginSchema = require('../requests/auth/login.request');
const forgetSchema = require('../requests/auth/forget.request');
const resetSchema = require('../requests/auth/reset.request');

router.post('/signup', validate(signupSchema), checkExistingUser, authController.signup);
router.post('/verify', auth, validate(verifySchema), authController.verify);
router.post('/login', validate(loginSchema), verifyLogin, authController.login);
router.post('/forget', validate(forgetSchema), verifyEmailExists, authController.forget);
router.post('/reset', validate(resetSchema), verifyResetToken, authController.reset);
router.post('/logout', auth, authController.logout);

module.exports = router;
