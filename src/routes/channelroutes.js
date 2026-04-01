const express = require('express');
const router = express.Router();

const channelController = require('../controllers/ChannelController');
const { validate } = require('../middlewares/ResponseHandlerMiddleware');
const auth = require('../middlewares/auth/CheckTokenMiddleware');

const channelExist = require('../middlewares/Channel/CheckChannelExistMiddleware');
const channelCreate = require('../middlewares/Channel/CheckChannelCreateMiddleware');
const memberCheck = require('../middlewares/Channel/MemberCheckMiddleware');
const channelAdmin = require('../middlewares/Channel/CheckChannelAdminMiddleware');
const channelAddMember = require('../middlewares/Channel/CheckChannelAddMemberMiddleware');
const channelRemoveMember = require('../middlewares/Channel/CheckChannelRemoveMemberMiddleware');

const createChannelSchema = require('../Requests/Channel/CreateChannelRequest');
const readChannelSchema = require('../Requests/Channel/ReadChannelRequest');
const updateChannelSchema = require('../Requests/Channel/UpdateChannelRequest');
const deleteChannelSchema = require('../Requests/Channel/DeleteChannelRequest');
const addMemberSchema = require('../Requests/Channel/AddMemberRequest');
const removeMemberSchema = require('../Requests/Channel/RemoveMemberRequest');

// All channel routes require authentication
router.use(auth);

router.post('/create', 
    validate(createChannelSchema), 
    memberCheck, 
    channelCreate, 
    channelController.create
);

router.get('/read', 
    validate(readChannelSchema), 
    channelExist, 
    channelController.read
);

router.patch('/update', 
    validate(updateChannelSchema), 
    channelExist, 
    channelAdmin, 
    channelController.update
);

router.delete('/delete', 
    validate(deleteChannelSchema), 
    channelExist, 
    channelAdmin, 
    channelController.deleteChannel
);

router.post('/add-member', 
    validate(addMemberSchema), 
    channelExist, 
    channelAdmin, 
    channelAddMember, 
    channelController.addMember
);

router.delete('/remove-member', 
    validate(removeMemberSchema), 
    channelExist, 
    channelAdmin, 
    channelRemoveMember, 
    channelController.removeMember
);

module.exports = router;

