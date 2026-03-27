const express = require("express");
const router = express.Router();
const multer = require("multer");

const messageController = require("../controllers/message.controller");
const { validate } = require("../middlewares/validation.middleware");
const auth = require("../middlewares/auth/auth.middleware");

const verifyChannelMember = require("../middlewares/message/verifyChannelMember.middleware");
const verifyMessageExists = require("../middlewares/message/verifyMessageExists.middleware");
const verifyMessageOwner = require("../middlewares/message/verifyMessageOwner.middleware");
const verifyFileAttached = require("../middlewares/message/verifyFileAttached.middleware");
const verifyUpdatePayload = require("../middlewares/message/verifyUpdatePayload.middleware");

const createSchema = require("../requests/message/create.request");
const readSchema = require("../requests/message/read.request");
const updateSchema = require("../requests/message/update.request");
const deleteSchema = require("../requests/message/delete.request");

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/messages/create
// text message  → multipart or json: { channelId, type: 'text', content }
// file message  → multipart:         { channelId, type: 'file' }  + file field
router.post(
  "/create",
  auth,
  upload.single("file"),
  validate(createSchema),
  verifyFileAttached,
  verifyChannelMember,
  messageController.create,
);

// GET /api/messages/read
// all messages  → { channelId, page?, limit? }
// single text   → { messageId }             — returns JSON
// single file   → { messageId }             — streams file download
router.get(
  "/read",
  auth,
  validate(readSchema),
  verifyMessageExists,
  messageController.read,
);

// PUT /api/messages/update
// text message  → { messageId, content }
// file message  → multipart: { messageId }  + file field
router.put(
  "/update",
  auth,
  upload.single("file"),
  validate(updateSchema),
  verifyMessageExists,
  verifyMessageOwner,
  verifyUpdatePayload,
  messageController.update,
);

// DELETE /api/messages/delete
// { messageId }
router.delete(
  "/delete",
  auth,
  validate(deleteSchema),
  verifyMessageExists,
  verifyMessageOwner,
  messageController.delete,
);

module.exports = router;
