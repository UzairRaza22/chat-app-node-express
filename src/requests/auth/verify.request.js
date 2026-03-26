const Joi = require('joi');

const verifySchema = Joi.object({
    email: Joi.string().email().required()
});

module.exports = verifySchema;
