const { asyncHandler } = require("../validation.middleware");

const verifyUpdatePayload = asyncHandler(async (req, res, next) => {
  const message = req.message;
  const { content } = req.validatedData;

  if (message.type === "text" && !content) {
    return res.status(400).json({
      message: "content is required to update a text message.",
    });
  }

  if (message.type === "file" && !req.file) {
    return res.status(400).json({
      message: "A new file is required to update a file message.",
    });
  }

  next();
});

module.exports = verifyUpdatePayload;
