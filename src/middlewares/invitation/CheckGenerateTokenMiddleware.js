const crypto = require('crypto');
const { asyncHandler } = require('../Validate');

/**
 * Generate a secure deterministic invitation token
 * Uses HMAC with JWT_SECRET for consistency and security
 */
const generateToken = (email, workspaceId) => {
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    return crypto
        .createHmac('sha256', secret)
        .update(`${email}:${workspaceId}`)
        .digest('hex');
};

/**
 * Middleware to generate invitation tokens
 * Attaches generateToken function to request for use by other middleware
 */
const checkGenerateToken = asyncHandler(async (req, res, next) => {
    // Attach the generateToken function to request object
    req.generateToken = generateToken;
    next();
});

module.exports = {
    generateToken,
    checkGenerateToken
};
