const { asyncHandler } = require("../Validate");

const verifyUpdatePayload = asyncHandler(async (req, res, next) => {
  const message = req.message;
  const { content } = req.validatedData;

  if (message.type === "text" && !content) {
    const err = new Error("content is required to update a text message.");
    err.statusCode = 400;
    return next(err);
  }

  if (message.type === "file" && !req.file) {
    const err = new Error("A new file is required to update a file message.");
    err.statusCode = 400;
    return next(err);
  }

  next();
});

module.exports = verifyUpdatePayload;
