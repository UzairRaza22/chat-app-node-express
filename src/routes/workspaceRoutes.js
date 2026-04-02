const express = require('express');
const router = express.Router();

const workspaceController = require('../controllers/workspacecontroller');
const { validate } = require('../middlewares/Validate');
const auth = require('../middlewares/auth/checktokenmiddleware');

// Workspace Middlewares (lowercase)
const checkWorkspaceExists = require('../middlewares/workspace/checkworkspaceexistsmiddleware');
const checkWorkspaceExist = require('../middlewares/workspace/checkworkspaceexistmiddleware');
const checkUniqueWorkspace = require('../middlewares/workspace/checkuniqueworkspacemiddleware');
const checkWorkspaceCreator = require('../middlewares/workspace/checkworkspacecreatemiddleware');
const checkMembersExist = require('../middlewares/workspace/checkmembersexistmiddleware');
const checkReadWorkspace = require('../middlewares/workspace/checkreadworkspacemiddleware');
const checkInvitationMembers = require('../middlewares/workspace/checkinvitationmembersmiddleware');

// Request Schemas (lowercase)
const createWorkspaceSchema = require('../requests/workspace/createworkspacerequest');
const updateWorkspaceSchema = require('../requests/workspace/updateworkspacerequest');
const addWorkspaceMemberSchema = require('../requests/workspace/addworkspacememberrequest');
const removeWorkspaceMemberSchema = require('../requests/workspace/removeworkspacememberrequest');
const readWorkspaceSchema = require('../requests/workspace/readworkspacerequest');
const deleteWorkspaceSchema = require('../requests/workspace/deleteworkspacerequest');
const inviteWorkspaceMemberSchema = require('../requests/workspace/inviteworkspacememberrequest');

// Routes

// 1. Get workspaces (All OR Single based on workspace_id in body)
router.get('/read', auth, validate(readWorkspaceSchema), checkReadWorkspace, workspaceController.read);

// 2. Create a new workspace
router.post('/create', auth, validate(createWorkspaceSchema), checkUniqueWorkspace, workspaceController.create);

// 4. Update a workspace (owner only) -- passed in body
router.put('/update', auth, validate(updateWorkspaceSchema), checkWorkspaceExists, checkWorkspaceCreator, workspaceController.update);

// 5. Delete a workspace (owner only) -- passed in body
router.delete('/delete', auth, validate(deleteWorkspaceSchema), checkWorkspaceExists, checkWorkspaceCreator, workspaceController.delete);

// 6. Add members to a workspace (creator only) -- passed in body
router.post('/add-member', auth, validate(addWorkspaceMemberSchema), checkWorkspaceExists, checkWorkspaceCreator, checkMembersExist, workspaceController.addMember);

// 7. Remove members from a workspace (owner only) -- passed in body
router.delete('/remove-member', auth, validate(removeWorkspaceMemberSchema), checkWorkspaceExists, checkWorkspaceCreator, workspaceController.removeMember);

// 8. Invite members to a workspace (creator only) -- passed in body
router.post('/invite-member', auth, validate(inviteWorkspaceMemberSchema), checkWorkspaceExists, checkWorkspaceCreator, checkInvitationMembers, workspaceController.inviteMember);

module.exports = router;
