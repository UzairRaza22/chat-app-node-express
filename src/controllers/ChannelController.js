const Channel = require('/ChannelModel');
const ChannelResource = require('/ChannelResource');
const { asyncHandler } = require('/ResponseHandlerMiddleware');

/**
 * @desc    Create a new channel
 * @route   POST /api/channels/create
 */
const create = asyncHandler(async (req, res) => {
    const channel = await Channel.create(req.channelData);

    res.success({
        message: 'Channel created successfully.',
        channel: ChannelResource.make(channel)
    }, 201);
});

/**
 * @desc    Get channel details
 * @route   GET /api/channels/read
 */
const read = asyncHandler(async (req, res) => {
    res.success({
        channel: ChannelResource.make(req.channel)
    });
});

/**
 * @desc    Update a channel
 * @route   PATCH /api/channels/update
 */
const update = asyncHandler(async (req, res) => {
    const channel = req.channel;
    const { name } = req.validatedData;

    if (name) channel.name = name;
    await channel.save();

    res.success({
        message: 'Channel updated successfully.',
        channel: ChannelResource.make(channel)
    });
});

/**
 * @desc    Delete a channel
 * @route   DELETE /api/channels/delete
 */
const deleteChannel = asyncHandler(async (req, res) => {
    await req.channel.deleteOne();

    res.success({
        message: 'Channel deleted successfully.'
    });
});

/**
 * @desc    Add member to channel
 * @route   POST /api/channels/add-member
 */
const addMember = asyncHandler(async (req, res) => {
    const channel = req.channel;
    channel.members = req.members;
    await channel.save();

    res.success({
        message: 'Member added successfully.',
        channel: ChannelResource.make(channel)
    });
});

/**
 * @desc    Remove member from channel
 * @route   DELETE /api/channels/remove-member
 */
const removeMember = asyncHandler(async (req, res) => {
    const channel = req.channel;
    channel.members = req.members;
    await channel.save();

    res.success({
        message: 'Member removed successfully.',
        channel: ChannelResource.make(channel)
    });
});

module.exports = {
    create,
    read,
    update,
    deleteChannel,
    addMember,
    removeMember
};

