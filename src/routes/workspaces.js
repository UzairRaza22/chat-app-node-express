const express = require('express');
const router = express.Router();

const workspaceController = require('../controllers/WorkspaceController');
const { validate } = require('../middlewares/CheckValidationMiddleware');
const auth = require('../middlewares/auth/CheckTokenMiddleware');

// Workspace Middlewares (PascalCase)
const checkWorkspaceExists = require('../middlewares/workspace/CheckWorkspaceExistsMiddleware');
const checkWorkspaceExist = require('../middlewares/workspace/CheckWorkspaceExistMiddleware');
const checkUniqueWorkspace = require('../middlewares/workspace/CheckUniqueWorkspaceMiddleware');
const checkWorkspaceCreator = require('../middlewares/workspace/CheckWorkspaceCreateMiddleware');
const checkMembersExist = require('../middlewares/workspace/CheckMembersExistMiddleware');

// Request Schemas (PascalCase)
const createWorkspaceSchema = require('../requests/workspace/CreateWorkspaceRequest');
const updateWorkspaceSchema = require('../requests/workspace/UpdateWorkspaceRequest');
const addWorkspaceMemberSchema = require('../requests/workspace/AddWorkspaceMemberRequest');
const removeWorkspaceMemberSchema = require('../requests/workspace/RemoveWorkspaceMemberRequest');

// Routes

// 1. Get all workspaces for the authenticated user
router.get('/', auth, checkWorkspaceExist, workspaceController.readAll);

// 2. Create a new workspace
router.post('/', auth, validate(createWorkspaceSchema), checkUniqueWorkspace, workspaceController.create);

// 3. Get a single workspace
router.get('/:id', auth, checkWorkspaceExists, workspaceController.readOne);

// 4. Update a workspace (owner only)
router.put('/:id', auth, validate(updateWorkspaceSchema), checkWorkspaceExists, checkWorkspaceCreator, workspaceController.update);

// 5. Delete a workspace (owner only)
router.delete('/:id', auth, checkWorkspaceExists, checkWorkspaceCreator, workspaceController.delete);

// 6. Add members to a workspace (owner only)
router.post('/:id/members', auth, validate(addWorkspaceMemberSchema), checkWorkspaceExists, checkWorkspaceCreator, checkMembersExist, workspaceController.addMember);

// 7. Remove members from a workspace (owner only)
router.delete('/:id/members', auth, validate(removeWorkspaceMemberSchema), checkWorkspaceExists, checkWorkspaceCreator, workspaceController.removeMember);

module.exports = router;