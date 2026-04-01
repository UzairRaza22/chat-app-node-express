const express = require('express');
const router = express.Router();

const teamController = require('../controllers/teamcontroller');
const { validate } = require('../middlewares/responsehandlermiddleware');
const auth = require('../middlewares/auth/checktokenmiddleware');

// Middleware
const checkTeamExists = require('../middlewares/team/checkteamexists');
const checkWorkspaceCreatorTeam = require('../middlewares/team/checkworkspacecreatorteam');
const checkUniqueTeamName = require('../middlewares/team/checkuniqueteamname');
const checkWorkspaceMemberTeam = require('../middlewares/team/checkworkspacememberteam');
const checkTeamMemberExists = require('../middlewares/team/checkteammemberexists');
const checkTeamUpdatePayload = require('../middlewares/team/checkteamupdatepayload');

// Request Schemas
const createRequest = require('../requests/team/createrequest');
const readRequest = require('../requests/team/readrequest');
const updateRequest = require('../requests/team/updaterequest');
const deleteRequest = require('../requests/team/deleterequest');
const addMemberRequest = require('../requests/team/addmemberrequest');
const removeMemberRequest = require('../requests/team/removememberrequest');

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

