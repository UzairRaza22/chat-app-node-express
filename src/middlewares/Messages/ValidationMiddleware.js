const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  req.validatedData = value;
  next();
};

const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  req.validatedData = value;
  next();
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: "Server error",
    error: err.message,
  });
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
  errorHandler,
  successResponse,
};
