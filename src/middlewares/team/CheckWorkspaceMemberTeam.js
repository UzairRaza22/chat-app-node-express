const Workspace = require('../../Models/WorkspaceModel');
const { asyncHandler } = require('./CheckValidationMiddleware');

const checkWorkspaceMemberTeam = asyncHandler(async (req, res, next) => {
    const { members } = req.validatedData;

    const workspace = await Workspace.findById(req.team.workspace_id);

    if (!workspace) {
        return res.status(404).json({
            message: 'Workspace not found.'
        });
    }

    // --- SIR KA NAYA POINT START ---
    // Check karna ke action lene wala (current user) khud workspace ka member hai ya nahi
    const workspaceMemberIds = workspace.members.map(m => m.toString());
    
    if (!workspaceMemberIds.includes(req.user._id.toString())) {
        return res.status(403).json({
            message: 'You are not a member of this workspace. Action denied.'
        });
    }
    const invalidMembers = members.filter(memberId => !workspaceMemberIds.includes(memberId.toString()));

    if (invalidMembers.length > 0) {
        return res.status(400).json({
            message: 'One or more members are not part of the workspace.',
            invalid_members: invalidMembers
        });
    }

    next();
});

module.exports = checkWorkspaceMemberTeam;