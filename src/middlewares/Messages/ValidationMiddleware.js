const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body);

  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    return next(err);
  }

  req.validatedData = value;
  next();
};

const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query);

  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    return next(err);
  }

  req.validatedData = value;
  next();
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const successResponse = (req, res, next) => {
  res.success = (payload, statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      ...payload,
    });
  };
  next();
};

module.exports = {
  validate,
  validateQuery,
  asyncHandler,
  successResponse,
};
