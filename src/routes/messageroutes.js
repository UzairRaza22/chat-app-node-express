const express = require("express");
const router = express.Router();
const multer = require("multer");

const messageController = require("../controllers/MessageController");

// FIX: Path was wrong and filename is ValidationMiddleware
const { validate } = require("../middlewares/Messages/ValidationMiddleware");

// FIX: Check your auth folder - usually it's AuthMiddleware.js or similar
const auth = require("../middlewares/auth/CheckTokenMiddleware");

// FIX: Your screenshot showed the folder is "Messages" (Capital M)
// and filenames end with "Middleware" (Capital M)
const verifyChannelMember = require("../middlewares/Messages/VerifyChannelMemberMiddleware");
const verifyMessageExists = require("../middlewares/Messages/VerifyMessageExistsMiddleware");
const verifyMessageOwner = require("../middlewares/Messages/VerifyMessageOwnerMiddleware");
const verifyFileAttached = require("../middlewares/Messages/VerifyFileAttachedMiddleware");
const verifyUpdatePayload = require("../middlewares/Messages/VerifyUpdatePayloadMiddleware");

const handleFileUpload = require("../middlewares/Messages/HandleFileUploadMiddleware");
const handleFileUpdate = require("../middlewares/Messages/HandleFileUpdateMiddleware");
const handleFileDelete = require("../middlewares/Messages/HandleFileDeleteMiddleware");
const streamFile = require("../middlewares/Messages/StreamFileMiddleware");

// FIX: Your screenshot showed the folder is "Messages" (Capital M)
const createSchema = require("../requests/Messages/CreateMessageRequest");
const readSchema = require("../requests/Messages/ReadMessageRequest");
const updateSchema = require("../requests/Messages/UpdateMessageRequest");
const deleteSchema = require("../requests/Messages/DeleteMessageRequest");

const upload = multer({ storage: multer.memoryStorage() });

// ─── CREATE ──────────────────────────────────────────────────────────────────
// text:  raw JSON  → { channelId, type: 'text', content }
// file:  multipart → { channelId, type: 'file' } + file field
router.post(
  "/create",
  auth,
  upload.single("file"),
  validate(createSchema),
  verifyFileAttached,
  verifyChannelMember,
  handleFileUpload,
  messageController.create,
);

// ─── READ ─────────────────────────────────────────────────────────────────────
// POST is used so the payload is sent as raw JSON body — not query params.
//
// Payload decides the behaviour:
//   { messageId }                → single text message JSON response
//   { messageId } (file msg)     → file streamed directly as download
//   { channelId, page?, limit? } → paginated channel messages, newest first
router.post(
  "/read",
  auth,
  validate(readSchema),
  verifyMessageExists,
  streamFile,
  messageController.read,
);

// ─── UPDATE ───────────────────────────────────────────────────────────────────
// text:  raw JSON  → { messageId, content }
// file:  multipart → { messageId } + file field
router.put(
  "/update",
  auth,
  upload.single("file"),
  validate(updateSchema),
  verifyMessageExists,
  verifyMessageOwner,
  verifyUpdatePayload,
  handleFileUpdate,
  messageController.update,
);

// ─── DELETE ───────────────────────────────────────────────────────────────────
// raw JSON → { messageId }
router.delete(
  "/delete",
  auth,
  validate(deleteSchema),
  verifyMessageExists,
  verifyMessageOwner,
  handleFileDelete,
  messageController.delete,
);

module.exports = router;
