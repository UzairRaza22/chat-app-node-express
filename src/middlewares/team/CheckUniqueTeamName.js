const Team = require('../../Models/TeamModel');
const { asyncHandler } = require('../ResponseHandlerMiddleware');
const AppError = require('../../utils/AppError');

const checkUniqueTeamName = asyncHandler(async (req, res, next) => {
    const { workspace_id, name, team_id } = req.validatedData;
    const searchWorkspaceId = workspace_id || (req.team ? req.team.workspace_id : null);
    
    const query = { workspace_id: searchWorkspaceId, name };
    if (team_id || (req.team && req.team._id)) {
        query._id = { $ne: team_id || req.team._id };
    }

    const existing = await Team.findOne(query);
    if (existing) {
        return next(new AppError('A team with this name already exists in this workspace.', 409));
    }

    next();
});

module.exports = checkUniqueTeamName;
