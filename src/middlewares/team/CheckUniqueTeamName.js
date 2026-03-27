const Team = require('../../Models/TeamModel');
const { asyncHandler } = require('../CheckValidationMiddleware');

const checkUniqueTeamName = asyncHandler(async (req, res, next) => {
    const { workspace_id, name, team_id } = req.validatedData;

    const query = { workspace_id, name };
    
    // If updating, exclude current team from uniqueness check
    if (team_id) {
        query._id = { $ne: team_id };
    }

    const existing = await Team.findOne(query);

    if (existing) {
        return res.status(400).json({
            message: 'A team with this name already exists in this workspace.'
        });
    }

    next();
});

module.exports = checkUniqueTeamName;
