const express = require('express');
const router = express.Router();

const teamController = require('../controllers/TeamController');
const { validate } = require('../middlewares/ResponseHandlerMiddleware');
const auth = require('../middlewares/auth/CheckTokenMiddleware');

// Middleware
const checkTeamExists = require('../middlewares/team/CheckTeamExists');
const checkWorkspaceCreatorTeam = require('../middlewares/team/CheckWorkspaceCreatorTeam');
const checkUniqueTeamName = require('../middlewares/team/CheckUniqueTeamName');
const checkWorkspaceMemberTeam = require('../middlewares/team/CheckWorkspaceMemberTeam');
const checkTeamMemberExists = require('../middlewares/team/CheckTeamMemberExists');
const checkTeamUpdatePayload = require('../middlewares/team/CheckTeamUpdatePayload');

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

