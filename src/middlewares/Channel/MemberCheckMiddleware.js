const { asyncHandler } = require('../CheckValidationMiddleware');

const memberCheck = asyncHandler(async (req, res, next) => {
    // TODO: Implement workspace/team membership validation later
    next();
});

module.exports = memberCheck;
