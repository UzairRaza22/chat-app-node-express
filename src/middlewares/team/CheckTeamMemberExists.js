const { asyncHandler } = require('../CheckValidationMiddleware');

const checkTeamMemberExists = asyncHandler(async (req, res, next) => {
    const { members } = req.validatedData;

    const teamMemberIds = req.team.members.map(m => m.toString());

    const duplicateMembers = members.filter(memberId => teamMemberIds.includes(memberId.toString()));

    if (duplicateMembers.length > 0) {
        return res.status(409).json({
            message: 'One or more members are already in the team.',
            duplicate_members: duplicateMembers
        });
    }

    next();
});

module.exports = checkTeamMemberExists;
