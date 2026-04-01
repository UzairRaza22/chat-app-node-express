const Workspace = require('../Models/WorkspaceModel');
const User = require('../Models/UserModel');
const WorkspaceResource = require('../Resources/WorkspaceResource');
const { asyncHandler } = require('../Middlewares/CheckValidationMiddleware');

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
 * @desc    Add members to a workspace (handles both user IDs and emails)
 * @route   POST /api/workspaces/add-member
 */
const addMember = asyncHandler(async (req, res) => {
    const { processedResults, emailResults } = req;
    const workspace = req.workspace;

    // Merge processed results with email results
    const finalResults = processedResults.map(result => {
        if (result.status === 'pending_email') {
            // Find corresponding email result
            const emailResult = emailResults.find(email => email.member === result.member);
            return emailResult || result;
        }
        return result;
    });

    // Get updated workspace
    const updatedWorkspace = await Workspace.findById(workspace._id);

    res.success({
        message: 'Member processing completed.',
        data: {
            workspace: WorkspaceResource.make(updatedWorkspace),
            results: finalResults
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

module.exports = {
    read,
    create,
    update,
    delete: deletes,
    addMember,
    removeMember
};