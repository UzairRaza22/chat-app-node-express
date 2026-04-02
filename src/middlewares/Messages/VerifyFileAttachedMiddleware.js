const { asyncHandler } = require("../Validate");

const verifyFileAttached = asyncHandler(async (req, res, next) => {
  const { type } = req.validatedData;

  if (type === "file" && !req.file) {
    const err = new Error(
      'No file attached. Please upload a file when type is "file".',
    );
    err.statusCode = 400;
    return next(err);
  }

  next();
});

module.exports = verifyFileAttached;
