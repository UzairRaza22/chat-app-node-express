const Workspace = require('../Models/WorkspaceModel');
const WorkspaceResource = require('../Resources/WorkspaceResource');
const { asyncHandler } = require('../middlewares/ResponseHandlerMiddleware');

/**
 * @desc    Get all workspaces for the authenticated user
 * @route   GET /api/workspaces
 */
const readAll = asyncHandler(async (req, res) => {
    res.success({
        message: 'Workspaces retrieved successfully.',
        data: WorkspaceResource.collection(req.userWorkspaces)
    });
});

/**
 * @desc    Get a single workspace by ID
 * @route   GET /api/workspaces/:id
 */
const readOne = asyncHandler(async (req, res) => {
    res.success({
        message: 'Workspace retrieved successfully.',
        data: WorkspaceResource.make(req.workspace)
    });
});

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

    res.success({
        message: 'Workspace created successfully.',
        data: WorkspaceResource.make(workspace)
    }, 201);
});

/**
 * @desc    Update a workspace
 * @route   PUT /api/workspaces/:id
 */
const update = asyncHandler(async (req, res) => {
    const { name, description } = req.validatedData;

    Object.assign(req.workspace, { name, description });
    await req.workspace.save();

    res.success({
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

    res.success({
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

    res.success({
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

    res.success({
        message: 'Members removed successfully.',
        data: WorkspaceResource.make(updated)
    });
});



/**
 * @desc    Get a single workspace or all workspaces
 * @route   GET /api/workspaces/read
 */
const read = asyncHandler(async (req, res) => {
    res.success(req.responseData);
});

module.exports = {
    read,
    create,
    update,
    delete: deletes,
    addMember,
    removeMember
};
