const express = require('express');
const router = express.Router();

const invitationController = require('../controllers/invitationcontroller');
const { validate } = require('../middlewares/Validate');
const auth = require('../middlewares/auth/checktokenmiddleware');

// Request Schemas
const acceptInvitationSchema = require('../requests/invitation/acceptinvitationrequest');

/**
 * @desc    Accept invitation by token (after login)
 * @route   POST /api/invitations/accept
 */
router.post('/accept', auth, validate(acceptInvitationSchema), invitationController.acceptInvitationByToken);

module.exports = router;
