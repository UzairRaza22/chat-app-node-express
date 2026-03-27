const Message = require("../models/message.model");
const {
  uploadFileToGridFS,
  updateFileInGridFS,
  downloadFileFromGridFS,
  deleteFileFromGridFS,
} = require("../config/gridfs");
const {
  messageResponse,
  messageListResponse,
} = require("../resources/message.resource");
const { asyncHandler } = require("../middlewares/validation.middleware");

// POST /api/messages/create
// Handles both text and file messages.
// Payload: { channelId, type, content? }  + file (multipart) when type = 'file'
const create = asyncHandler(async (req, res) => {
  const { channelId, type, content } = req.validatedData;
  const senderId = req.user._id;

  if (type === "file") {
    const { buffer, originalname, mimetype } = req.file;
    const uploaded = await uploadFileToGridFS(buffer, originalname, mimetype);

    const message = await Message.create({
      channelId,
      senderId,
      type: "file",
      file: {
        fileId: uploaded.fileId,
        filename: uploaded.filename,
        mimetype: uploaded.mimetype,
        size: uploaded.size,
      },
    });

    return res.status(201).success({
      message: "File message sent successfully.",
      data: messageResponse(message),
    });
  }

  const message = await Message.create({
    channelId,
    senderId,
    type: "text",
    content,
  });

  return res.status(201).success({
    message: "Message sent successfully.",
    data: messageResponse(message),
  });
});

// GET /api/messages/read
// If channelId is given  → returns paginated list of messages for that channel.
// If messageId is given  → returns that single message OR streams the file if it's a file message.
// Payload: { channelId?, messageId?, page?, limit? }
const read = asyncHandler(async (req, res) => {
  const { channelId, messageId, page, limit } = req.validatedData;

  if (messageId) {
    const message = req.message;

    if (message.type === "file") {
      const downloadStream = downloadFileFromGridFS(message.file.fileId);
      res.set("Content-Type", message.file.mimetype);
      res.set(
        "Content-Disposition",
        `attachment; filename="${message.file.filename}"`,
      );
      return downloadStream.pipe(res);
    }

    return res.success({
      message: "Message fetched successfully.",
      data: messageResponse(message),
    });
  }

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
    data: messageListResponse(messages, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }),
  });
});

// PUT /api/messages/update
// Text message  → updates content field.
// File message  → replaces old file in GridFS with new uploaded file.
// Payload: { messageId, content? }  + file (multipart) when updating a file message
const update = asyncHandler(async (req, res) => {
  const message = req.message;
  const { content } = req.validatedData;

  if (message.type === "file") {
    const { buffer, originalname, mimetype } = req.file;
    const updated = await updateFileInGridFS(
      message.file.fileId,
      buffer,
      originalname,
      mimetype,
    );

    message.file = {
      fileId: updated.fileId,
      filename: updated.filename,
      mimetype: updated.mimetype,
      size: updated.size,
    };
    message.isEdited = true;
    await message.save();

    return res.success({
      message: "File message updated successfully.",
      data: messageResponse(message),
    });
  }

  message.content = content;
  message.isEdited = true;
  await message.save();

  return res.success({
    message: "Message updated successfully.",
    data: messageResponse(message),
  });
});

// DELETE /api/messages/delete
// Soft deletes the message. If it is a file message, also removes file from GridFS.
// Payload: { messageId }
const delete_ = asyncHandler(async (req, res) => {
  const message = req.message;

  if (message.type === "file") {
    await deleteFileFromGridFS(message.file.fileId);
  }

  message.isDeleted = true;
  await message.save();

  return res.success({
    message: "Message deleted successfully.",
  });
});

module.exports = { create, read, update, delete: delete_ };
