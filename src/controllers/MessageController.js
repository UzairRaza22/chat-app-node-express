const Message = require("../models/message.model");
const MessageResource = require("../resources/MessageResource");
const { asyncHandler } = require("../middlewares/validation.middleware");

// ─── CREATE ──────────────────────────────────────────────────────────────────
// POST /api/messages/create
//
// Pipeline before this:
//   validate → verifyFileAttached → verifyChannelMember → handleFileUpload
//
// handleFileUpload guarantees:
//   req.uploadedFile = { fileId, filename, mimetype, size }  (type === 'file')
//   req.uploadedFile = null                                   (type === 'text')
//
// Controller reads req.uploadedFile unconditionally — no branching.
const create = asyncHandler(async (req, res) => {
  const { channelId, type, content } = req.validatedData;

  const message = await Message.create({
    channelId,
    senderId: req.user._id,
    type,
    content: content ?? null,
    file: req.uploadedFile, // null for text, GridFS object for file
  });

  return res.status(201).success({
    message: "Message sent successfully.",
    data: MessageResource.make(message),
  });
});

// ─── READ ─────────────────────────────────────────────────────────────────────
// GET /api/messages/read
//
// Payload: { messageId } → single message (text JSON or file stream)
// Payload: { channelId } → paginated channel messages, newest first
//
// Pipeline before this:
//   validateQuery → verifyMessageExists → streamFile
//
// verifyMessageExists:
//   messageId present → fetches message, sets req.message, calls next()
//   channelId present → skips DB lookup, calls next() (req.message stays undefined)
//
// streamFile:
//   req.message is a file message → pipes GridFS stream to res, cycle ends here
//   req.message is a text message → calls next(), controller returns JSON below
//   req.message is undefined      → calls next(), controller runs channel query below
//
// By the time we reach here:
//   req.message set   → always a text message  → return single message JSON
//   req.message unset → channelId flow          → return paginated list
const read = asyncHandler(async (req, res) => {
  const { channelId, page, limit } = req.validatedData;

  // ── single text message ───────────────────────────────────────────────────
  // req.message is set only when messageId was in the payload AND the message
  // is not a file (file messages were already streamed by StreamFileMiddleware).
  const singleMessage = req.message;
  if (singleMessage) {
    return res.success({
      message: "Message fetched successfully.",
      data: MessageResource.make(singleMessage),
    });
  }

  // ── paginated channel messages ────────────────────────────────────────────
  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    Message.find({ channelId, isDeleted: false })
      .populate("senderId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Message.countDocuments({ channelId, isDeleted: false }),
  ]);

  return res.success({
    message: "Messages fetched successfully.",
    data: {
      messages: MessageResource.collection(messages),
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    },
  });
});

// ─── UPDATE ───────────────────────────────────────────────────────────────────
// PUT /api/messages/update
//
// Pipeline before this:
//   validate → verifyMessageExists → verifyMessageOwner
//   → verifyUpdatePayload → handleFileUpdate
//
// handleFileUpdate guarantees:
//   req.updatedFile = { fileId, filename, mimetype, size }  (message.type === 'file')
//   req.updatedFile = null                                   (message.type === 'text')
//
// Object.assign merges req.updatedFile onto message.file only when non-null.
// For text messages req.updatedFile is null so message.file stays untouched.
const update = asyncHandler(async (req, res) => {
  const message = req.message;

  Object.assign(message, {
    content: req.validatedData.content ?? message.content,
    file: req.updatedFile ?? message.file,
    isEdited: true,
  });

  await message.save();

  return res.success({
    message: "Message updated successfully.",
    data: MessageResource.make(message),
  });
});

// ─── DELETE ───────────────────────────────────────────────────────────────────
// DELETE /api/messages/delete
//
// Pipeline before this:
//   validate → verifyMessageExists → verifyMessageOwner → handleFileDelete
//
// handleFileDelete removes the GridFS file before we reach here (file messages).
// For text messages handleFileDelete is a no-op. Controller is always the same.
const delete_ = asyncHandler(async (req, res) => {
  req.message.isDeleted = true;
  await req.message.save();

  return res.success({
    message: "Message deleted successfully.",
  });
});

module.exports = { create, read, update, delete: delete_ };
