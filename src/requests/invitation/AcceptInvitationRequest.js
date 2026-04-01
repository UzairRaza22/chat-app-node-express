const Joi = require('joi');

const acceptInvitationSchema = Joi.object({
    token: Joi.string().required().length(64).pattern(/^[0-9a-fA-F]+$/).messages({
        'string.base': 'Invitation token must be a string.',
        'string.empty': 'Invitation token is required.',
        'string.length': 'Invitation token must be 64 characters long.',
        'string.pattern.base': 'Invitation token must contain only alphanumeric characters.',
        'any.required': 'Invitation token is required.'
    }),
    workspaceId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).messages({
        'string.base': 'Workspace ID must be a string.',
        'string.empty': 'Workspace ID is required.',
        'string.pattern.base': 'Invalid Workspace ID format.',
        'any.required': 'Workspace ID is required.'
    })
});

module.exports = acceptInvitationSchema;
