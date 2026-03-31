const { asyncHandler } = require("./ValidationMiddleware");

const verifyFileAttached = asyncHandler(async (req, res, next) => {
  const { type } = req.validatedData;

  if (type === "file" && !req.file) {
    return res.status(400).json({
      message: 'No file attached. Please upload a file when type is "file".',
    });
  }

  next();
});

module.exports = verifyFileAttached;
