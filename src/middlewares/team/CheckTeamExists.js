const Team = require('../../Models/TeamModel');
const { asyncHandler } = require("../Validate"); 
const { createError } = require("../../utils/GlobalResponseHandler");

/**
 * @desc Verify if team exists and if the current user is the creator
 */
const checkTeamExists = asyncHandler(async (req, res, next) => {
    const { team_id } = req.validatedData || req.params;

    const team = await Team.findById(team_id);

    if (!team) {
        return next(createError('Team not found.', 404));
    }

    if (team.creator_id.toString() !== req.user._id.toString()) {
        return next(createError('You do not have permission to manage this team.', 403));
    }

    req.team = team;
    next();
});

module.exports = checkTeamExists;

