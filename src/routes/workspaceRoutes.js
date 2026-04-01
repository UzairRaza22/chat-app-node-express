const express = require ('express');

const router = express.Router();



const workspaceController = require('../controllers/WorkspaceController');

const { validate } = require('../middlewares/ResponseHandlerMiddleware');

const auth = require('../middlewares/auth/CheckTokenMiddleware');

// Workspace Middlewares (lowercase)

const checkWorkspaceExists  = require('../middlewares/workspace/CheckWorkspaceExistsMiddleware');

const checkWorkspaceExist   = require('../middlewares/workspace/CheckWorkspaceExistMiddleware');

const checkUniqueWorkspace  = require('../middlewares/workspace/CheckUniqueWorkspaceMiddleware');

const checkWorkspaceCreator = require('../middlewares/workspace/CheckWorkspaceCreateMiddleware');

const checkMembersExist     = require('../middlewares/workspace/CheckMembersExistMiddleware');

const checkReadWorkspace    = require('../middlewares/workspace/CheckReadWorkspaceMiddleware');



// Request Schemas (PascalCase)

const createWorkspaceSchema       = require('../Requests/Workspace/CreateWorkspaceRequest');

const updateWorkspaceSchema       = require('../Requests/Workspace/UpdateWorkspaceRequest');

const addWorkspaceMemberSchema    = require('../Requests/Workspace/AddWorkspaceMemberRequest');

const removeWorkspaceMemberSchema = require('../Requests/Workspace/RemoveWorkspaceMemberRequest');

const readWorkspaceSchema         = require('../Requests/Workspace/ReadWorkspaceRequest');

const deleteWorkspaceSchema       = require('../Requests/Workspace/DeleteWorkspaceRequest');



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
