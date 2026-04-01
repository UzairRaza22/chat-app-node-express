const express = require ('express');

const router = express.Router();



const workspaceController = require('/WorkspaceController');

const { validate } = require('/ResponseHandlerMiddleware');

const auth = require('/auth/CheckTokenMiddleware');

// Workspace Middlewares (lowercase)

const checkWorkspaceExists  = require('/workspace/CheckWorkspaceExistsMiddleware');

const checkWorkspaceExist   = require('/workspace/CheckWorkspaceExistMiddleware');

const checkUniqueWorkspace  = require('/workspace/CheckUniqueWorkspaceMiddleware');

const checkWorkspaceCreator = require('/workspace/CheckWorkspaceCreateMiddleware');

const checkMembersExist     = require('/workspace/CheckMembersExistMiddleware');

const checkReadWorkspace    = require('/workspace/CheckReadWorkspaceMiddleware');



// Request Schemas (PascalCase)

const createWorkspaceSchema       = require('/Workspace/CreateWorkspaceRequest');

const updateWorkspaceSchema       = require('/Workspace/UpdateWorkspaceRequest');

const addWorkspaceMemberSchema    = require('/Workspace/AddWorkspaceMemberRequest');

const removeWorkspaceMemberSchema = require('/Workspace/RemoveWorkspaceMemberRequest');

const readWorkspaceSchema         = require('/Workspace/ReadWorkspaceRequest');

const deleteWorkspaceSchema       = require('/Workspace/DeleteWorkspaceRequest');



// Routes



// 1. Get workspaces (All OR Single based on workspace_id in body)

router.get('/read', auth, validate(readWorkspaceSchema), checkReadWorkspace, workspaceController.read);



// 2. Create a new workspace

router.post('/create', auth, validate(createWorkspaceSchema), checkUniqueWorkspace, workspaceController.create);



// 4. Update a workspace (owner only) -- passed in body

router.put('/update', auth, validate(updateWorkspaceSchema), checkWorkspaceExists, checkWorkspaceCreator, workspaceController.update);



// 5. Delete a workspace (owner only) -- passed in body

router.delete('/delete', auth, validate(deleteWorkspaceSchema), checkWorkspaceExists, checkWorkspaceCreator, workspaceController.delete);



// 6. Add members to a workspace (owner only) -- passed in body

router.post('/add-member', auth, validate(addWorkspaceMemberSchema), checkWorkspaceExists, checkWorkspaceCreator, checkMembersExist, workspaceController.addMember);



// 7. Remove members from a workspace (owner only) -- passed in body

router.delete('/remove-member', auth, validate(removeWorkspaceMemberSchema), checkWorkspaceExists, checkWorkspaceCreator, workspaceController.removeMember);



module.exports = router;
