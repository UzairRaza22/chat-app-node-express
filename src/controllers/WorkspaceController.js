const Workspace = require('../models/WorkspaceModel');
const WorkspaceResource = require('../resources/WorkspaceResource');
const { asyncHandler } = require('../middlewares/Validate');
const { createError } = require('../utils/GlobalResponseHandler.js');

const uniqueIds = (arr) => Array.from(new Set((arr || []).map(id => id.toString())));
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
req.event = {
        eventName: 'workspace_created',
        module: 'workspace',
        operation: 'create',
        referenceId: workspace._id,
        userIds: workspace.members,
        metadata: { workspace: WorkspaceResource.make(workspace) }
    };
    res.success({
        message: 'Workspace created successfully.',
        data: WorkspaceResource.make(workspace)
    }, 201);
});

/**
 * @desc    Get a single workspace or all workspaces
 * @route   GET /api/workspaces/read
 */
const read = asyncHandler(async (req, res) => {
    res.success(req.responseData);
});

/**
 * @desc    Update a workspace
 * @route   PUT /api/workspaces/:id
 */
const update = asyncHandler(async (req, res) => {
    const { name, description } = req.validatedData;

    Object.assign(req.workspace, { name, description });
    await req.workspace.save();
req.event = {
        eventName: 'workspace_updated',
        module: 'workspace',
        operation: 'update',
        referenceId: req.workspace._id,
        userIds: req.workspace.members,
        metadata: { workspace: WorkspaceResource.make(req.workspace) }
    };
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

    req.event = {
        eventName: 'workspace_deleted',
        module: 'workspace',
        operation: 'delete',
        referenceId: req.workspace._id,
        userIds: req.workspace.members,
        metadata: { workspaceId: req.workspace._id.toString() }
    };
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
    //event logging
req.event = {
        eventName: 'workspace_member_added',
        module: 'workspace',
        operation: 'member_added',
        referenceId: updatedWorkspace._id,
        userIds: uniqueIds([...(updatedWorkspace.members || []), ...addedUserIds]),
        metadata: {
            workspace: WorkspaceResource.make(updatedWorkspace),
            workspaceId: updatedWorkspace._id.toString(),
            addedUserIds: addedUserIds.map(id => id.toString()),
            results: finalResults
        }
    };
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
req.event = {
        eventName: 'workspace_member_removed',
        module: 'workspace',
        operation: 'member_removed',
        referenceId: updated._id,
        userIds: uniqueIds([...(updated.members || []), ...(members || [])]),
        metadata: {
            workspace: WorkspaceResource.make(updated),
            workspaceId: updated._id.toString(),
            removedUserIds: (members || []).map(id => id.toString())
        }
    };
    res.success({
        message: 'Members removed successfully.',
        data: WorkspaceResource.make(updated)
    });
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
req.event = {
        eventName: 'workspace_member_invited',
        module: 'workspace',
        operation: 'member_invited',
        referenceId: updatedWorkspace._id,
        userIds: uniqueIds([...(updatedWorkspace.members || []), ...invitedUserIds]),
        metadata: {
            workspace: WorkspaceResource.make(updatedWorkspace),
            workspaceId: updatedWorkspace._id.toString(),
            invitedUserIds: invitedUserIds.map(id => id.toString()),
            results: processedResults
        }
    };
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
