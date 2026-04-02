const Workspace = require('../models/workspacemodel');
const WorkspaceResource = require('../resources/workspaceresource');
const { asyncHandler } = require('../middlewares/Validate');
const AppError = require('../utils/apperror');

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
 * @desc    Add members to a workspace (only accepts user IDs)
 * @route   POST /api/workspaces/add-member
 */
const addMember = asyncHandler(async (req, res) => {
    const { processedResults } = req;
    const workspace = req.workspace;

    // Get updated workspace
    const updatedWorkspace = await Workspace.findById(workspace._id);

    // All members added successfully (middleware ensures this)
    res.success({
        message: 'Members added successfully to workspace.',
        data: {
            workspace: WorkspaceResource.make(updatedWorkspace),
            results: processedResults
        }
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

/**
 * @desc    Invite members to a workspace (handles both existing users and invitations)
 * @route   POST /api/workspaces/invite-member
 */
const inviteMember = asyncHandler(async (req, res) => {
    const { processedResults } = req;
    const workspace = req.workspace;

    // Get updated workspace
    const updatedWorkspace = await Workspace.findById(workspace._id);

    // All invitations processed successfully (middleware ensures this)
    res.success({
        message: 'Invitations processed successfully.',
        data: {
            workspace: WorkspaceResource.make(updatedWorkspace),
            results: processedResults
        }
    });
});

module.exports = {
    read,
    create,
    update,
    delete: deletes,
    addMember,
    removeMember,
    inviteMember
};
