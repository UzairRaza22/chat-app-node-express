const { asyncHandler } = require('../Validate');
const transporter = require('../../config/mail');

/**
 * Middleware to handle invitation email sending
 * Processes invitation results and sends emails
 */
const sendInvitationEmail = asyncHandler(async (req, res, next) => {
    const { workspace, invitationResults } = req;
    
    // If no invitation results to process, continue
    if (!invitationResults || invitationResults.length === 0) {
        return next();
    }

    const emailResults = [];

    for (const result of invitationResults) {
        if (result.type === 'invitation') {
            try {
                // Send invitation email
                const mailOptions = {
                    from: '"Workspace Team" <support@nodeapp.com>',
                    to: result.invitation.email,
                    subject: `You're invited to join "${workspace.name}" workspace`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                            <h2 style="color: #007bff;">🚀 Workspace Invitation</h2>
                            <p>Hello,</p>
                            <p>You've been invited to join the <strong>${workspace.name}</strong> workspace by <strong>${req.user.name}</strong> (${req.user.email}).</p>
                            
                            <div style="background-color: #f1f3f5; padding: 15px; border-radius: 5px; border-left: 5px solid #007bff; margin: 20px 0;">
                                <p style="margin: 5px 0;"><strong>Workspace ID:</strong> <code>${workspace._id}</code></p>
                                <p style="margin: 5px 0;"><strong>Your Unique Joining Token:</strong> <code style="word-break: break-all;">${result.invitation.token}</code></p>
                                <p style="font-size: 12px; color: #666;">Note: This token is generated specifically for your email address.</p>
                            </div>

                            ${workspace.description ? `<p><strong>About this workspace:</strong> ${workspace.description}</p>` : ''}
                            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                                <h3 style="color: #495057; margin-top: 0;">📋 How to Join:</h3>
                                <ol style="color: #495057; line-height: 1.6;">
                                    <li><strong>Register</strong> or <strong>Login</strong> with your email (${result.invitation.email})</li>
                                    <li><strong>Accept</strong> the invitation using the provided Workspace ID and Token in the app</li>
                                </ol>
                            </div>
                            <p><strong>Important:</strong> This invitation expires in 48 hours.</p>
                            <hr style="margin: 30px 0;">
                            <p style="color: #666; font-size: 14px;">If you didn't expect this invitation, you can safely ignore this email.</p>
                        </div>
                    `
                };

                await transporter.sendMail(mailOptions);
                console.log('✅ Invitation email sent to:', result.invitation.email);

                emailResults.push({
                    member: result.email,
                    status: result.isNew ? 'invitation_sent' : 'invitation_resent',
                    message: result.isNew ? 'Invitation email sent (48 hours valid)' : 'Invitation email resent (valid invitation)',
                    invitationId: result.invitation._id
                });

            } catch (emailError) {
                console.error('❌ Email sending failed for', result.invitation.email, ':', emailError.message);
                
                emailResults.push({
                    member: result.email,
                    status: 'email_failed',
                    message: `Failed to send invitation email: ${emailError.message}`,
                    invitationId: result.invitation._id
                });
            }
        }
    }

    // Attach email results to request for controller to use
    req.emailResults = emailResults;
    next();
});

module.exports = sendInvitationEmail;

