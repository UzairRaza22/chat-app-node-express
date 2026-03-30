const Joi = require('joi');

const addWorkspaceMemberSchema = Joi.object({
    workspace_id: Joi.string().required(),
    members: Joi.array().items(Joi.string().required()).min(1).required()
});

module.exports = addWorkspaceMemberSchema;
