const express = require('express');
const router = express.Router();

const teamController = require('../Controllers/TeamController');
const { validate } = require('../Middlewares/CheckValidationMiddleware');
const auth = require('../Middlewares/Auth/CheckTokenMiddleware');

// Middleware
const checkTeamExists = require('../Middlewares/Team/CheckTeamExists');
const checkWorkspaceCreatorTeam = require('../Middlewares/Team/CheckWorkspaceCreatorTeam');
const checkUniqueTeamName = require('../Middlewares/Team/CheckUniqueTeamName');
const checkWorkspaceMemberTeam = require('../Middlewares/Team/CheckWorkspaceMemberTeam');
const checkTeamMemberExists = require('../Middlewares/Team/CheckTeamMemberExists');
const checkTeamUpdatePayload = require('../Middlewares/Team/CheckTeamUpdatePayload');

// Request Schemas
const createRequest = require('../Requests/Team/CreateRequest');
const readRequest = require('../Requests/Team/ReadRequest');
const updateRequest = require('../Requests/Team/UpdateRequest');
const deleteRequest = require('../Requests/Team/DeleteRequest');
const addMemberRequest = require('../Requests/Team/AddMemberRequest');
const removeMemberRequest = require('../Requests/Team/RemoveMemberRequest');

// Routes

// 1. Create a team
router.post('/create',
    auth,
    validate(createRequest),
    checkUniqueTeamName,
    teamController.create
);

// 2. Read a team
router.get('/read',
    auth,
    validate(readRequest),
    checkTeamExists,
    teamController.read
);

// 3. Update a team (owner only)
router.put('/update',
    auth,
    validate(updateRequest),
    checkTeamExists,
    checkWorkspaceCreatorTeam,
    checkTeamUpdatePayload,
    checkUniqueTeamName,
    teamController.update
);

// 4. Delete a team (owner only)
router.delete('/delete',
    auth,
    validate(deleteRequest),
    checkTeamExists,
    checkWorkspaceCreatorTeam,
    teamController.deleteTeam
);

// 5. Add members to a team (owner only)
router.post('/add-member',
    auth,
    validate(addMemberRequest),
    checkTeamExists,
    checkWorkspaceCreatorTeam,
    checkWorkspaceMemberTeam,
    checkTeamMemberExists,
    teamController.addMember
);

// 6. Remove members from a team (owner only)
router.delete('/remove-member',
    auth,
    validate(removeMemberRequest),
    checkTeamExists,
    checkWorkspaceCreatorTeam,
    teamController.removeMember
);

module.exports = router;
