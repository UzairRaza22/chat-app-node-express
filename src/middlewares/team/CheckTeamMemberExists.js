const { asyncHandler } = require('../CheckValidationMiddleware');
const AppError = require('../../utils/AppError'); 

const checkTeamMemberExists = asyncHandler(async (req, res, next) => {
    const { members } = req.validatedData;

    const teamMemberIds = req.team.members.map(m => m.toString());

    const duplicateMembers = members.filter(memberId => teamMemberIds.includes(memberId.toString()));

    if (duplicateMembers.length > 0) {
        return next(new AppError(`Members already in team: ${duplicateMembers.join(', ')}`, 409));
    }

    next();
});

module.exports = checkTeamMemberExists;