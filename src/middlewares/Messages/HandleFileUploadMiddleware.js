const { uploadFileToGridFS } = require("../../Config/gridfs");
const { asyncHandler } = require("../ResponseHandlerMiddleware");

/**
 * Runs before the create controller.
 *
 * - type === 'file'  → uploads to GridFS, sets req.uploadedFile to the result object
 * - type === 'text'  → sets req.uploadedFile to null
 *
 * The controller reads req.uploadedFile unconditionally with no branching.
 */
const handleFileUpload = asyncHandler(async (req, res, next) => {
  const { type } = req.validatedData;

  if (type !== "file") {
    req.uploadedFile = null;
    return next();
  }

  const { buffer, originalname, mimetype } = req.file;
  req.uploadedFile = await uploadFileToGridFS(buffer, originalname, mimetype);

  next();
});

module.exports = handleFileUpload;
