const express = require('express');
const router = express.Router();

const authController = require('../controllers/authcontroller');
const { asyncHandler } = require("../middlewares/Validate");;
const auth = require('../middlewares/auth/checktokenmiddleware');
const checkExistingUser = require('../middlewares/auth/checkexistingusermiddleware');
const verifyLogin = require('../middlewares/auth/checkloginmiddleware');
const verifyEmailExists = require('../middlewares/auth/checkemailexistsmiddleware');
const verifyResetToken = require('../middlewares/auth/checkresettokenmiddleware');
const verifyAccountToken = require('../middlewares/auth/checkaccounttokenmiddleware');

const signupSchema = require('../requests/auth/signuprequest');
const verifySchema = require('../requests/auth/verifyrequest');
const loginSchema = require('../requests/auth/loginrequest');
const forgetSchema = require('../requests/auth/forgetrequest');
const resetSchema = require('../requests/auth/resetrequest');

// Routes
router.post('/signup', validate(signupSchema), checkExistingUser, authController.signup);
router.post('/verify', validate(verifySchema), verifyAccountToken, authController.verify);
router.post('/login', validate(loginSchema), verifyLogin, authController.login);
router.post('/forget', validate(forgetSchema), verifyEmailExists, authController.forget);
router.post('/reset', validate(resetSchema), verifyResetToken, authController.reset);
router.post('/logout', auth, authController.logout);

module.exports = router;

