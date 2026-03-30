const Workspace = require('../Models/WorkspaceModel');
const WorkspaceResource = require('../Resources/WorkspaceResource');
const { asyncHandler } = require('../Middlewares/CheckValidationMiddleware');

/**
 * @desc    Create a new workspace
 * @route   POST /api/workspaces
 */
const create = asyncHandler(async (req, res) => {
    const { name, description } = req.validatedData;

    const workspace = await Workspace.create({
        name,
        description,
        ownerId: req.user._id,
        members: [req.user._id]
    });

    res.status(201).json({
        message: 'Workspace created successfully.',
        data: WorkspaceResource.make(workspace)
    });
});

/**
 * @desc    Update a workspace
 * @route   PUT /api/workspaces/:id
 */
const update = asyncHandler(async (req, res) => {
    const { name, description } = req.validatedData;

    Object.assign(req.workspace, { name, description });
    await req.workspace.save();

    res.json({
        message: 'Workspace updated successfully.',
        data: WorkspaceResource.make(req.workspace)
    });
});

/**
 * @desc    Delete a workspace
 * @route   DELETE /api/workspaces/:id
 */
const deletes = asyncHandler(async (req, res) => {
    await req.workspace.deleteOne();

    res.json({
        message: 'Workspace deleted successfully.'
    });
});

/**
 * @desc    Add members to a workspace
 * @route   POST /api/workspaces/:id/members
 */
const addMember = asyncHandler(async (req, res) => {
    const { members } = req.validatedData;

    await Workspace.findByIdAndUpdate(
        req.workspace._id,
        { $addToSet: { members: { $each: members } } }
    );

    const updated = await Workspace.findById(req.workspace._id);

    res.json({
        message: 'Members added successfully.',
        data: WorkspaceResource.make(updated)
    });
});

/**
 * @desc    Remove members from a workspace
 * @route   DELETE /api/workspaces/:id/members
 */
const removeMember = asyncHandler(async (req, res) => {
    const { members } = req.validatedData;

    await Workspace.findByIdAndUpdate(
        req.workspace._id,
        { $pull: { members: { $in: members } } }
    );

    const updated = await Workspace.findById(req.workspace._id);

    res.json({
        message: 'Members removed successfully.',
        data: WorkspaceResource.make(updated)
    });
});



/**
 * @desc    Get a single workspace or all workspaces
 * @route   GET /api/workspaces/read
 */
const read = asyncHandler(async (req, res) => {
    res.json(req.responseData);
});

module.exports = {
    read,
    create,
    update,
    delete: deletes,
    addMember,
    removeMember
};