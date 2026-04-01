const { downloadFileFromGridFS } = require('../../config/gridfs');

/**
 * Runs on GET /api/messages/read for both single-message and channel flows.
 *
 * - No req.message (channelId flow)    → skips, calls next()
 * - req.message is a text message      → skips, calls next() so controller returns JSON
 * - req.message is a file message      → streams file directly to client, ends cycle
 */
const streamFile = (req, res, next) => {
  const message = req.message;

  if (!message) return next();
  if (message.type !== "file") return next();

  const downloadStream = downloadFileFromGridFS(message.file.fileId);
  res.set("Content-Type", message.file.mimetype);
  res.set(
    "Content-Disposition",
    `attachment; filename="${message.file.filename}"`,
  );

  downloadStream.pipe(res);
};

module.exports = streamFile;
