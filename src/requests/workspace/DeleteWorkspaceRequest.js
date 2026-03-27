const Joi = require('joi');

// No body required for delete operation
const deleteWorkspaceSchema = Joi.object({});

module.exports = deleteWorkspaceSchema;
