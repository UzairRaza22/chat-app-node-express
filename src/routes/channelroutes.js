const express = require('express');
const router = express.Router();

const channelController = require('/ChannelController');
const { validate } = require('/ResponseHandlerMiddleware');
const auth = require('/auth/CheckTokenMiddleware');

const channelExist = require('/Channel/CheckChannelExistMiddleware');
const channelCreate = require('/Channel/CheckChannelCreateMiddleware');
const memberCheck = require('/Channel/MemberCheckMiddleware');
const channelAdmin = require('/Channel/CheckChannelAdminMiddleware');
const channelAddMember = require('/Channel/CheckChannelAddMemberMiddleware');
const channelRemoveMember = require('/Channel/CheckChannelRemoveMemberMiddleware');

const createChannelSchema = require('/Channel/CreateChannelRequest');
const readChannelSchema = require('/Channel/ReadChannelRequest');
const updateChannelSchema = require('/Channel/UpdateChannelRequest');
const deleteChannelSchema = require('/Channel/DeleteChannelRequest');
const addMemberSchema = require('/Channel/AddMemberRequest');
const removeMemberSchema = require('/Channel/RemoveMemberRequest');

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

