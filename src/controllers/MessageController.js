const Message = require('../models/messagemodel');
const MessageResource = require('../resources/messageresource');
const { asyncHandler } = require('../middlewares/responsehandlermiddleware');

const create = asyncHandler(async (req, res) => {
  const { channelId, type, content } = req.validatedData;

  const message = await Message.create({
    channelId,
    senderId: req.user._id,
    type,
    content: content ?? null,
    file: req.uploadedFile, // null for text, GridFS object for file
  });

  return res.success({
    message: "Message sent successfully.",
    data: MessageResource.make(message),
  });
});

const read = asyncHandler(async (req, res) => {
  const { channelId, page, limit } = req.validatedData;

  const singleMessage = req.message;
  if (singleMessage) {
    return res.success({
      message: "Message fetched successfully.",
      data: MessageResource.make(singleMessage),
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

const delete_ = asyncHandler(async (req, res) => {
  req.message.isDeleted = true;
  await req.message.save();

  return res.success({
    message: "Message deleted successfully.",
  });
});

module.exports = { create, read, update, delete: delete_ };

