const express = require('express');
const router = express.Router();

const invitationController = require('../Controllers/InvitationController');
const { validate } = require('../Middlewares/CheckValidationMiddleware');
const auth = require('../Middlewares/Auth/CheckTokenMiddleware');

// Request Schemas
const acceptInvitationSchema = require('../Requests/invitation/AcceptInvitationRequest');

/**
 * @desc    Accept invitation by token (after login)
 * @route   POST /api/invitations/accept
 */
router.post('/accept', auth, validate(acceptInvitationSchema), invitationController.acceptInvitationByToken);

module.exports = router;
