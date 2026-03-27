const Joi = require('joi');

const removeWorkspaceMemberSchema = Joi.object({
    members: Joi.array().items(Joi.string().required()).min(1).required()
});

module.exports = removeWorkspaceMemberSchema;
