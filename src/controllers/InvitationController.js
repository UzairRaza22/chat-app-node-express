const { asyncHandler } = require('../Middlewares/CheckValidationMiddleware');
const Invitation = require('../Models/InvitationModel');
const User = require('../Models/UserModel');
const Workspace = require('../Models/WorkspaceModel');
const InvitationService = require('../utils/InvitationService');

const acceptInvitationByToken = asyncHandler(async (req, res) => {
    const { token, workspaceId } = req.validatedData;
    const user = req.user; // Authenticated user

    // Find and validate invitation
    const invitation = await Invitation.findOne({ 
        token, 
        status: 'pending' 
    }).populate('workspaceId');

    if (!invitation) {
        return res.status(400).json({
            success: false,
            message: 'Invalid or expired invitation token.'
        });
    }

    // Verify if workspaceId matches
    if (invitation.workspaceId._id.toString() !== workspaceId.toString()) {
        return res.status(400).json({
            success: false,
            message: 'Invitation does not match the provided workspace.'
        });
    }

    if (invitation.isExpired()) {
        return res.status(400).json({
            success: false,
            message: 'Invitation token has expired.'
        });
    }

    // Check if invitation email matches user email
    if (invitation.email.toLowerCase() !== user.email.toLowerCase()) {
        return res.status(400).json({
            success: false,
            message: 'This invitation is for a different email address.'
        });
    }

    // Check if user is already a member of the workspace
    if (invitation.workspaceId.members.includes(user._id)) {
        return res.status(400).json({
            success: false,
            message: 'You are already a member of this workspace.'
        });
    }

    // Accept the invitation
    const invitationResult = await InvitationService.acceptInvitation(token, user._id, workspaceId);
    
    if (invitationResult.success) {
        res.json({
            success: true,
            message: 'Invitation accepted successfully! You have been added to the workspace.',
            workspace: {
                id: invitationResult.workspace._id,
                name: invitationResult.workspace.name,
                description: invitationResult.workspace.description
            }
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'Failed to accept invitation. Please try again.'
        });
    }
});

module.exports = {
    acceptInvitationByToken
};
