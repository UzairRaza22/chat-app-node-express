const User = require('../../models/usermodel');
const { asyncHandler } = require('../responsehandlermiddleware');
const AppError = require('../../utils/apperror');
const InvitationService = require('../../utils/invitationservice');

/**
 * Processes members for workspace addition
 * - Validates existing users (user IDs)
 * - Processes emails (existing users vs invitations)
 * - Handles verification checks
 * - Creates invitations for non-existent users
 * - Prepares data for email sending
 */
const checkMembersExist = asyncHandler(async (req, res, next) => {
    const { members } = req.validatedData;
    const workspace = req.workspace;
    const results = [];
    const invitationResults = [];

    for (const member of members) {
        // Check if it's an email or user ID
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member);
        
        if (isEmail) {
            // Handle email - check if user exists
            const existingUser = await User.findOne({ email: member.toLowerCase() });
            
            if (existingUser) {
                // User exists, check if already a member
                if (workspace.members.includes(existingUser._id)) {
                    results.push({
                        member: member,
                        status: 'already_member',
                        message: 'User is already a member of this workspace.'
                    });
                    continue;
                }
                
                // Check if user is verified
                if (!existingUser.isVerified) {
                    results.push({
                        member: member,
                        status: 'unverified_user',
                        message: 'Cannot add unverified users to workspace.'
                    });
                    continue;
                }
                
                // Add verified existing user to workspace
                workspace.members.push(existingUser._id);
                await workspace.save();
                
                results.push({
                    member: member,
                    status: 'added',
                    message: 'Existing verified user added to workspace',
                    userId: existingUser._id
                });
            } else {
                // User doesn't exist, create invitation
                const invitationResult = await InvitationService.createInvitation(
                    workspace._id, 
                    member, 
                    req.user._id
                );
                
                // Prepare invitation for email sending
                invitationResults.push({
                    type: 'invitation',
                    email: member,
                    invitation: invitationResult.invitation,
                    isNew: invitationResult.message === 'New invitation created successfully'
                });

                results.push({
                    member: member,
                    status: 'pending_email',
                    message: 'Invitation email will be sent to the user.'
                });
            }
        } else {
            // Handle as user ID
            try {
                const userById = await User.findById(member);
                if (!userById) {
                    results.push({
                        member: member,
                        status: 'not_found',
                        message: 'User ID not found.'
                    });
                    continue;
                }

                if (workspace.members.includes(userById._id)) {
                    results.push({
                        member: member,
                        status: 'already_member',
                        message: 'User is already a member of this workspace.'
                    });
                    continue;
                }

                if (!userById.isVerified) {
                    results.push({
                        member: member,
                        status: 'unverified_user',
                        message: 'Cannot add unverified users to workspace.'
                    });
                    continue;
                }

                workspace.members.push(userById._id);
                await workspace.save();

                results.push({
                    member: member,
                    status: 'added',
                    message: 'User added to workspace by ID',
                    userId: userById._id
                });
            } catch (err) {
                results.push({
                    member: member,
                    status: 'invalid_id',
                    message: 'Invalid user ID format.'
                });
            }
        }
    }

    // Attach results and invitation data to request
    req.processedResults = results;
    req.invitationResults = invitationResults;
    req.workspace = workspace; // Updated workspace with new members
    
    next();
});

module.exports = checkMembersExist;
