const Joi = require('joi');

// No body required for reading a single workspace
const readWorkspaceSchema = Joi.object({});

module.exports = readWorkspaceSchema;
