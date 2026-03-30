const Team = require('../../Models/TeamModel');
const { asyncHandler } = require('../CheckValidationMiddleware');

const checkTeamExists = asyncHandler(async (req, res, next) => {
    const { team_id } = req.validatedData || req.params;

    const team = await Team.findById(team_id);

    if (!team) {
        return res.status(404).json({
            message: 'Team not found.'
        });
    }

    req.team = team;
    next();
});

module.exports = checkTeamExists;
