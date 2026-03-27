const express = require("express");
const router = express.Router();
const multer = require("multer");

const messageController = require("../controllers/MessageController");
const { validate } = require("../middlewares/validation.middleware");
const auth = require("../middlewares/auth/auth.middleware");

// existing middlewares
const verifyChannelMember = require("../middlewares/message/VerifyChannelMemberMiddleware");
const verifyMessageExists = require("../middlewares/message/VerifyMessageExistsMiddleware");
const verifyMessageOwner = require("../middlewares/message/VerifyMessageOwnerMiddleware");
const verifyFileAttached = require("../middlewares/message/VerifyFileAttachedMiddleware");
const verifyUpdatePayload = require("../middlewares/message/VerifyUpdatePayloadMiddleware");

// new middlewares
const handleFileUpload = require("../middlewares/message/HandleFileUploadMiddleware");
const handleFileUpdate = require("../middlewares/message/HandleFileUpdateMiddleware");
const handleFileDelete = require("../middlewares/message/HandleFileDeleteMiddleware");
const streamFile = require("../middlewares/message/StreamFileMiddleware");

// request schemas
const createSchema = require("../requests/message/CreateMessageRequest");
const readSchema = require("../requests/message/ReadMessageRequest");
const updateSchema = require("../requests/message/UpdateMessageRequest");
const deleteSchema = require("../requests/message/DeleteMessageRequest");

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
