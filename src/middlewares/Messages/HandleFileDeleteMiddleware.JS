const { deleteFileFromGridFS } = require("../../config/gridfs");
const { asyncHandler } = require("../validation.middleware");

/**
 * Runs before the delete controller.
 * Removes the file from GridFS when the message is a file message.
 * For text messages it simply calls next().
 */
const handleFileDelete = asyncHandler(async (req, res, next) => {
  const message = req.message;

  if (message.type !== "file") return next();

  await deleteFileFromGridFS(message.file.fileId);

  next();
});

module.exports = handleFileDelete;
