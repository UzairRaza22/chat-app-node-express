const Team = require('../../Models/TeamModel');
const { asyncHandler } = require('../ResponseHandlerMiddleware');
const AppError = require('../../utils/AppError');

const checkTeamExists = asyncHandler(async (req, res, next) => {
    const { team_id } = req.validatedData || req.params;

    const team = await Team.findById(team_id);

    if (!team) {
        return next(new AppError('Team not found.', 404));
    }

    if (team.creator_id.toString() !== req.user._id.toString()) {
        return next(new AppError('You do not have permission to manage this team.', 403));
    }

    req.team = team;
    next();
});

module.exports = checkTeamExists;
