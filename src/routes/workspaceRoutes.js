const express = require('express');



const router = express.Router();







const workspaceController = require('../Controllers/WorkspaceController');



const { validate } = require('../Middlewares/CheckValidationMiddleware');



const auth = require('../Middlewares/Auth/CheckTokenMiddleware');







// Workspace Middlewares (PascalCase)



const checkWorkspaceExists  = require('../Middlewares/Workspace/CheckWorkspaceExistsMiddleware');



const checkWorkspaceExist   = require('../Middlewares/Workspace/CheckWorkspaceExistMiddleware');



const checkUniqueWorkspace  = require('../Middlewares/Workspace/CheckUniqueWorkspaceMiddleware');



const checkWorkspaceCreator = require('../Middlewares/Workspace/CheckWorkspaceCreateMiddleware');



const checkMembersExist     = require('../Middlewares/Workspace/CheckMembersExistMiddleware');



const checkReadWorkspace    = require('../Middlewares/Workspace/CheckReadWorkspaceMiddleware');



const sendInvitationEmail = require('../Middlewares/Workspace/SendInvitationEmailMiddleware');







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







// 6. Add members to a workspace (creator only) -- passed in body



router.post('/add-member', auth, validate(addWorkspaceMemberSchema), checkWorkspaceExists, checkWorkspaceCreator, checkMembersExist, sendInvitationEmail, workspaceController.addMember);







// 7. Remove members from a workspace (owner only) -- passed in body



router.delete('/remove-member', auth, validate(removeWorkspaceMemberSchema), checkWorkspaceExists, checkWorkspaceCreator, workspaceController.removeMember);




module.exports = router;