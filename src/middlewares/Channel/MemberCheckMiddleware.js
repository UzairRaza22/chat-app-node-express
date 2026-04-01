const Workspace = require('../../Models/WorkspaceModel');
const Team = require('../../Models/TeamModel');
<<<<<<< HEAD
const { asyncHandler } = require('../CheckValidationMiddleware');
const AppError = require('../../utils/AppError');
=======
const { asyncHandler } = require('./CheckValidationMiddleware');
>>>>>>> 188e872936afc37377ce5e8a584d8a43059cf436

const memberCheck = asyncHandler(async (req, res, next) => {
    const user = req.user;
    const data = req.validatedData;

    if (!user) {
        return next(new AppError('Unauthorized.', 401));
    }

    if (!data) {
        return next(new AppError('Invalid request data.', 400));
    }

    const { workspace_id, team_id, type } = data;
    if (!workspace_id) {
        return next(new AppError('workspace_id is required.', 400));
    }

    const workspace = await Workspace.findById(workspace_id);
    if (!workspace) {
        return next(new AppError('Workspace not found.', 404));
    }

    const userId = String(user._id);
    const workspaceMemberIds = workspace.members.map(member => String(member));
    if (!workspaceMemberIds.includes(userId)) {
        return next(new AppError('User is not part of this workspace.', 403));
    }

    req.workspace = workspace;

    if (type === 'direct') {
        return next();
    }

    if (!team_id) {
        return next(new AppError('team_id is required for public or private channels.', 400));
    }

    const team = await Team.findById(team_id);
    if (!team) {
        return next(new AppError('Team not found.', 404));
    }

    if (String(team.workspace_id) !== String(workspace._id)) {
        return next(new AppError('Team does not belong to this workspace.', 400));
    }

    const teamMemberIds = team.members.map(member => String(member));
    if (!teamMemberIds.includes(userId)) {
        return next(new AppError('User is not part of this team.', 403));
    }

    req.team = team;
    next();
});

module.exports = memberCheck;
