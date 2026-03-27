const messageResponse = (message) => {
  const response = {
    id: message._id,
    channelId: message.channelId,
    sender: message.senderId,
    type: message.type,
    isEdited: message.isEdited,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };

  if (message.type === "text") {
    response.content = message.content;
  }

  if (message.type === "file") {
    response.file = {
      fileId: message.file.fileId,
      filename: message.file.filename,
      mimetype: message.file.mimetype,
      size: message.file.size,
    };
  }

  return response;
};

const messageListResponse = (messages, meta = {}) => {
  return {
    messages: messages.map(messageResponse),
    meta,
  };
};

module.exports = { messageResponse, messageListResponse };
