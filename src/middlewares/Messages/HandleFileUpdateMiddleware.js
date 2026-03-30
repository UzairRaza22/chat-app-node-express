const { updateFileInGridFS } = require("../../config/gridfs");
const { asyncHandler } = require("../validation.middleware");

/**
 * Runs before the update controller.
 *
 * - message.type === 'file'  → deletes old GridFS file, uploads new one,
 *                              sets req.updatedFile to the result object
 * - message.type === 'text'  → sets req.updatedFile to null
 *
 * The controller reads req.updatedFile unconditionally with no branching.
 */
const handleFileUpdate = asyncHandler(async (req, res, next) => {
  const message = req.message;

  if (message.type !== "file") {
    req.updatedFile = null;
    return next();
  }

  const { buffer, originalname, mimetype } = req.file;
  req.updatedFile = await updateFileInGridFS(
    message.file.fileId,
    buffer,
    originalname,
    mimetype,
  );

  next();
});

module.exports = handleFileUpdate;
