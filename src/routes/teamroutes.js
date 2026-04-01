const express = require('express');
const router = express.Router();

const teamController = require('/TeamController');
const { validate } = require('/ResponseHandlerMiddleware');
const auth = require('/auth/CheckTokenMiddleware');

// Middleware
const checkTeamExists = require('/team/CheckTeamExists');
const checkWorkspaceCreatorTeam = require('/team/CheckWorkspaceCreatorTeam');
const checkUniqueTeamName = require('/team/CheckUniqueTeamName');
const checkWorkspaceMemberTeam = require('/team/CheckWorkspaceMemberTeam');
const checkTeamMemberExists = require('/team/CheckTeamMemberExists');
const checkTeamUpdatePayload = require('/team/CheckTeamUpdatePayload');

// Request Schemas
const createRequest = require('/Team/CreateRequest');
const readRequest = require('/Team/ReadRequest');
const updateRequest = require('/Team/UpdateRequest');
const deleteRequest = require('/Team/DeleteRequest');
const addMemberRequest = require('/Team/AddMemberRequest');
const removeMemberRequest = require('/Team/RemoveMemberRequest');

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

