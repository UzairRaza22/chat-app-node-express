const Team = require('../../Models/TeamModel');
const { asyncHandler } = require('./CheckValidationMiddleware');
const AppError = require('../../utils/AppError'); 

const checkUniqueTeamName = asyncHandler(async (req, res, next) => {
    const { workspace_id, name, team_id } = req.validatedData;

    const query = { workspace_id, name };
    
    if (team_id) {
        query._id = { $ne: team_id };
    }

    const existing = await Team.findOne(query);

    if (existing) {
        return next(new AppError('A team with this name already exists in this workspace.', 400));
    }

    next();
});

module.exports = checkUniqueTeamName;