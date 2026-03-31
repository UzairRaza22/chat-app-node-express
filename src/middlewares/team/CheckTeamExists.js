const Team = require('../../Models/TeamModel');
const { asyncHandler } = require('../CheckValidationMiddleware');
const AppError = require('../../utils/AppError');

const checkTeamExists = asyncHandler(async (req, res, next) => {
    const { team_id } = req.validatedData || req.params;

    const team = await Team.findById(team_id);

    if (!team) {
        return next(new AppError('Team not found.', 404));
    }

    req.team = team;
    next();
});

module.exports = checkTeamExists;
