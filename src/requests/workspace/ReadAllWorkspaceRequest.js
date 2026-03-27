const Joi = require('joi');

// No body required for listing all workspaces
const readAllWorkspaceSchema = Joi.object({});

module.exports = readAllWorkspaceSchema;
