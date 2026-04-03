const Message = require("../models/MessageModel");
const MessageResource = require("../resources/MessageResource");
const paginate = require("../utils/Paginate");
const { asyncHandler } = require("../middlewares/Validate");

const create = asyncHandler(async (req, res) => {
  const { channelId, type, content } = req.validatedData;

  const message = await Message.create({
    channelId,
    senderId: req.user._id,
    type,
    content: content ?? null,
    file: req.uploadedFile,
  });

  return res.success(
    "Message sent successfully.",
    MessageResource.make(message),
    201,
  );
});

const read = asyncHandler(async (req, res) => {
  const { channelId, page, limit } = req.validatedData;

  const singleMessage = req.message;
  if (singleMessage) {
    return res.success(
      "Message fetched successfully.",
      MessageResource.make(singleMessage),
    );
  }

  const result = await paginate(
    Message,
    { channelId, isDeleted: false },
    {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: { path: "senderId", select: "name email" },
    },
  );

  return res.success("Messages fetched successfully.", {
    messages: MessageResource.collection(result.data),
    meta: result.meta,
  });
});

const update = asyncHandler(async (req, res) => {
  const message = req.message;

  Object.assign(message, {
    content: req.validatedData.content ?? message.content,
    // file:  req.updatedFile ?? message.file,   // file update disabled
    isEdited: true,
  });

  await message.save();

  return res.success(
    "Message updated successfully.",
    MessageResource.make(message),
  );
});

const delete_ = asyncHandler(async (req, res) => {
  req.message.isDeleted = true;
  await req.message.save();

  return res.success("Message deleted successfully.", {});
});

module.exports = { create, read, update, delete: delete_ };
