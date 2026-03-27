const express = require('express');
const router = express.Router();

const teamController = require('../controllers/TeamController');
const { validate } = require('../middlewares/CheckValidationMiddleware');
const auth = require('../middlewares/auth/CheckTokenMiddleware');

// Middleware
const checkTeamExists = require('../middlewares/team/CheckTeamExists');
const checkWorkspaceCreatorTeam = require('../middlewares/team/CheckWorkspaceCreatorTeam');
const checkUniqueTeamName = require('../middlewares/team/CheckUniqueTeamName');
const checkWorkspaceMemberTeam = require('../middlewares/team/CheckWorkspaceMemberTeam');
const checkTeamMemberExists = require('../middlewares/team/CheckTeamMemberExists');
const checkTeamUpdatePayload = require('../middlewares/team/CheckTeamUpdatePayload');

// Request Schemas
const createRequest = require('../requests/team/CreateRequest');
const readRequest = require('../requests/team/ReadRequest');
const updateRequest = require('../requests/team/UpdateRequest');
const deleteRequest = require('../requests/team/DeleteRequest');
const addMemberRequest = require('../requests/team/AddMemberRequest');
const removeMemberRequest = require('../requests/team/RemoveMemberRequest');

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
    teamController.addmember
);

// 6. Remove members from a team (owner only)
router.delete('/remove-member',
    auth,
    validate(removeMemberRequest),
    checkTeamExists,
    checkWorkspaceCreatorTeam,
    teamController.removemember
);

module.exports = router;
