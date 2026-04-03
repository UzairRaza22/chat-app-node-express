const { asyncHandler } = require('../middlewares/Validate');
const Invitation = require('../models/InvitationModel');
const User = require('../models/UserModel');
const Workspace = require('../models/WorkspaceModel');
const InvitationService = require('../utils/InvitationService');
const { createError } = require('../utils/GlobalResponseHandler.js');

const acceptInvitationByToken = asyncHandler(async (req, res) => {
    const { token, workspaceId } = req.validatedData;
    const user = req.user; // Authenticated user

    // Find and validate invitation
    const invitation = await Invitation.findOne({ 
        token, 
        status: 'pending' 
    }).populate('workspaceId');

    if (!invitation) {
        return next(createError('Invalid or expired invitation token.', 400));
    }

    // Verify if workspaceId matches
    if (invitation.workspaceId._id.toString() !== workspaceId.toString()) {
        return next(createError('Invitation does not match the provided workspace.', 400));
    }

    if (invitation.isExpired()) {
        return next(createError('Invitation token has expired.', 400));
    }

    // Check if invitation email matches user email
    if (invitation.email.toLowerCase() !== user.email.toLowerCase()) {
        return next(createError('This invitation is for a different email address.', 400));
    }

    // Check if user is already a member of the workspace
    if (invitation.workspaceId.members.includes(user._id)) {
        return next(createError('You are already a member of this workspace.', 400));
    }

    // Accept the invitation
    const invitationResult = await InvitationService.acceptInvitation(token, user._id, workspaceId);
    
    if (invitationResult.success) {
        res.success({
            message: 'Invitation accepted successfully! You have been added to the workspace.',
            workspace: {
                id: invitationResult.workspace._id,
                name: invitationResult.workspace.name,
                description: invitationResult.workspace.description
            }
        });
    } else {
        return next(createError('Failed to accept invitation. Please try again.', 500));
    }
});

module.exports = {
    acceptInvitationByToken
};
