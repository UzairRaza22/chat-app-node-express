const express = require('express');
const router = express.Router();

const workspaceController = require('../Controllers/WorkspaceController');
const { validate } = require('../Middlewares/CheckValidationMiddleware');
const auth = require('../Middlewares/Auth/CheckTokenMiddleware');

// Workspace Middlewares (PascalCase)
const checkWorkspaceExists = require('../Middlewares/Workspace/CheckWorkspaceExistsMiddleware');
const checkWorkspaceExist = require('../Middlewares/Workspace/CheckWorkspaceExistMiddleware');
const checkUniqueWorkspace = require('../Middlewares/Workspace/CheckUniqueWorkspaceMiddleware');
const checkWorkspaceCreator = require('../Middlewares/Workspace/CheckWorkspaceCreateMiddleware');
const checkMembersExist = require('../Middlewares/Workspace/CheckMembersExistMiddleware');

// Request Schemas (PascalCase)
const createWorkspaceSchema = require('../Requests/Workspace/CreateWorkspaceRequest');
const updateWorkspaceSchema = require('../Requests/Workspace/UpdateWorkspaceRequest');
const addWorkspaceMemberSchema = require('../Requests/Workspace/AddWorkspaceMemberRequest');
const removeWorkspaceMemberSchema = require('../Requests/Workspace/RemoveWorkspaceMemberRequest');

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