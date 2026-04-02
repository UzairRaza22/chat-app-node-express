const User = require('../../models/usermodel');
const Invitation = require('../../models/InvitationModel');
const { asyncHandler } = require('../Validate');
const AppError = require('../../utils/apperror');
const crypto = require('crypto');
const transporter = require('../../config/mail');

/**
 * Processes member invitations for workspace
 * - Handles existing users (auto-add if verified)
 * - Creates invitations for non-existing users
 * - Prevents duplicate invitations
 * - Throws errors for any failures
 */
const checkInvitationMembers = asyncHandler(async (req, res, next) => {
    const { members } = req.validatedData;
    const workspace = req.workspace;
    const results = [];
    const errors = [];

    for (const email of members) {
        const normalizedEmail = email.toLowerCase().trim();
        
        try {
            // Check if user exists in database
            const existingUser = await User.findOne({ email: normalizedEmail });
            
            if (existingUser) {
                // User exists - handle auto-add logic
                const userIdStr = existingUser._id.toString();
                const workspaceMemberIds = workspace.members.map(memberId => memberId.toString());

                if (workspaceMemberIds.includes(userIdStr)) {
                    errors.push({
                        member: normalizedEmail,
                        reason: 'User is already a member of this workspace.'
                    });
                    continue;
                }

                // Check if user is verified
                if (!existingUser.isVerified) {
                    errors.push({
                        member: normalizedEmail,
                        reason: 'Cannot add unverified users to workspace.'
                    });
                    continue;
                }

                // Add verified existing user to workspace
                workspace.members.push(existingUser._id);
                await workspace.save();

                results.push({
                    member: normalizedEmail,
                    status: 'added',
                    message: 'Existing user added to workspace successfully',
                    userId: existingUser._id
                });
            } else {
                // User doesn't exist - create invitation
                try {
                    // Check if invitation already exists
                    const existingInvitation = await Invitation.findOne({
                        workspaceId: workspace._id,
                        email: normalizedEmail,
                        status: 'pending'
                    });

                    if (existingInvitation) {
                        errors.push({
                            member: normalizedEmail,
                            reason: 'Invitation already sent to this email.'
                        });
                        continue;
                    }

                    // Create new invitation
                    const invitationToken = crypto.randomBytes(32).toString('hex');
                    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

                    const invitation = await Invitation.create({
                        workspaceId: workspace._id,
                        email: normalizedEmail,
                        token: invitationToken,
                        status: 'pending',
                        inviterId: req.user._id,
                        expiresAt
                    });

                    // Send invitation email
                    try {
                        await transporter.sendMail({
                            from: `"${req.user.name}" <noreply@chatapp.com>`,
                            to: normalizedEmail,
                            subject: `You're invited to join "${workspace.name}" workspace`,
                            html: `
                                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                    <h2 style="color: #333;">You're Invited!</h2>
                                    <p>Hello,</p>
                                    <p><strong>${req.user.name}</strong> has invited you to join the workspace <strong>"${workspace.name}"</strong> on Chat App.</p>
                                    <p>To accept this invitation, simply sign up or log in to Chat App using this email address. You'll be automatically added to the workspace.</p>
                                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                                        <p style="margin: 0;"><strong>Workspace:</strong> ${workspace.name}</p>
                                        <p style="margin: 10px 0 0;"><strong>Invited by:</strong> ${req.user.name}</p>
                                        <p style="margin: 10px 0 0;"><strong>Expires:</strong> ${expiresAt.toLocaleDateString()}</p>
                                    </div>
                                    <p style="color: #666; font-size: 14px;">
                                        This invitation will expire in 7 days. If you don't have an account yet, 
                                        you can create one using this email address and you'll be automatically added to the workspace.
                                    </p>
                                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                                    <p style="color: #999; font-size: 12px;">
                                        This is an automated message. Please do not reply to this email.
                                    </p>
                                </div>
                            `
                        });
                    } catch (emailError) {
                        console.error('Failed to send invitation email:', emailError.message);
                        // Continue even if email fails, invitation is still created
                    }

                    results.push({
                        member: normalizedEmail,
                        status: 'invited',
                        message: 'Invitation sent successfully',
                        invitationId: invitation._id,
                        token: invitationToken
                    });
                } catch (invitationError) {
                    if (invitationError.code === 'DUPLICATE_INVITATION') {
                        errors.push({
                            member: normalizedEmail,
                            reason: 'Invitation already sent to this email.'
                        });
                    } else {
                        errors.push({
                            member: normalizedEmail,
                            reason: 'Failed to create invitation.'
                        });
                    }
                    continue;
                }
            }
        } catch (err) {
            errors.push({
                member: normalizedEmail,
                reason: 'Error processing invitation for this email.'
            });
        }
    }

    // If there are any errors, throw an error with the details
    if (errors.length > 0) {
        const error = new AppError('Failed to process some invitations.', 400);
        error.errors = errors;
        return next(error);
    }

    // Attach successful results to request
    req.processedResults = results;
    req.workspace = workspace; // Updated workspace with new members
    
    next();
});

module.exports = checkInvitationMembers;

