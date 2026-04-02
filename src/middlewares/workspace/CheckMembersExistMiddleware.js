<<<<<<< HEAD
const User = require('../../models/usermodel');
const { asyncHandler } = require('../responsehandlermiddleware');
const AppError = require('../../utils/apperror');
=======
const User = require('../../Models/UserModel');
const InvitationService = require('../../utils/InvitationService');
const { asyncHandler } = require('../CheckValidationMiddleware');
>>>>>>> b89fd9a5ed63ea4e0854216ac6d27f5d043ecb5b

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
            console.log(`🔍 Processing email: ${member}`);
            // Handle email - check if user exists
            const existingUser = await User.findOne({ email: member });
            
            if (existingUser) {
                console.log(`👤 User found: ${existingUser.email}, isVerified: ${existingUser.isVerified}`);
                
                // User exists, check if already a member
                if (workspace.members.includes(existingUser._id)) {
                    console.log(`⚠️ User already a member: ${member}`);
                    results.push({
                        member: member,
                        status: 'already_member',
                        message: 'User is already a member of this workspace.'
                    });
                    continue;
                }
                
                // Check if user is verified
                if (!existingUser.isVerified) {
                    console.log(`❌ User not verified: ${member}`);
                    results.push({
                        member: member,
                        status: 'unverified_user',
                        message: 'Cannot add unverified users to workspace.'
                    });
                    continue;
                }
                
                console.log(`✅ Adding verified user: ${member}`);
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
                console.log(`📧 User not found, processing invitation: ${member}`);
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

<<<<<<< HEAD
    if (users.length !== members.length) {
        return next(new AppError('One or more member user IDs do not exist.', 400));
=======
                // Add placeholder result (will be updated by email middleware)
                results.push({
                    member: member,
                    status: 'pending_email',
                    message: 'Invitation created, sending email...'
                });
            }
        } else {
            // Handle user ID - validate and add to workspace
            if (workspace.members.includes(member)) {
                results.push({
                    member: member,
                    status: 'already_member',
                    message: 'User is already a member of this workspace'
                });
                continue;
            }
            
            // Check if user exists and is verified
            const user = await User.findById(member);
            if (!user) {
                return res.error(`User ID ${member} does not exist.`);
            }
            
            if (!user.isVerified) {
                return res.error(`Cannot add unverified users to workspace.`);
            }
            
            workspace.members.push(member);
            await workspace.save();
            
            results.push({
                member: member,
                status: 'added',
                message: 'User added to workspace'
            });
        }
>>>>>>> b89fd9a5ed63ea4e0854216ac6d27f5d043ecb5b
    }

    // Attach results and invitation data to request
    req.processedResults = results;
    req.invitationResults = invitationResults;
    req.workspace = workspace; // Updated workspace with new members
    
    next();
});

module.exports = checkMembersExist;

