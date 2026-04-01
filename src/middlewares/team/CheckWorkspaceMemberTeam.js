const Workspace = require('../../Models/WorkspaceModel');
const { asyncHandler } = require('../CheckValidationMiddleware');
const AppError = require('../../utils/AppError'); 

const checkWorkspaceMemberTeam = asyncHandler(async (req, res, next) => {
    const { members } = req.validatedData;

    const workspace = await Workspace.findById(req.team.workspace_id);

    if (!workspace) {
        return next(new AppError('Workspace not found.', 404));
    }

    const workspaceMemberIds = workspace.members.map(m => m.toString());
    
    if (!workspaceMemberIds.includes(req.user._id.toString())) {
        return next(new AppError('You are not a member of this workspace. Action denied.', 403));
    }

    const invalidMembers = members.filter(memberId => !workspaceMemberIds.includes(memberId.toString()));

    if (invalidMembers.length > 0) {
        return next(new AppError(`One or more members are not part of the workspace: ${invalidMembers.join(', ')}`, 400));
    }

    next();
});

module.exports = checkWorkspaceMemberTeam;