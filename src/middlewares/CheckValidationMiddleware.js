const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
        // Tag Joi error
        error.isJoi = true;
        return next(error);
    }

    req.validatedData = value;
    next();
};

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { validate, asyncHandler };
