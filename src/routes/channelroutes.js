const express = require('express');
const router = express.Router();

const channelController = require('../controllers/ChannelController');
const { validate } = require('../middlewares/CheckValidationMiddleware');
const auth = require('../middlewares/auth/CheckTokenMiddleware');

const channelExist = require('../middlewares/Channel/CheckChannelExistMiddleware');
const channelCreate = require('../middlewares/Channel/CheckChannelCreateMiddleware');
const memberCheck = require('../middlewares/Channel/MemberCheckMiddleware');
const channelAdmin = require('../middlewares/Channel/CheckChannelAdminMiddleware');
const channelAddMember = require('../middlewares/Channel/CheckChannelAddMemberMiddleware');
const channelRemoveMember = require('../middlewares/Channel/CheckChannelRemoveMemberMiddleware');

const createChannelSchema = require('../requests/Channel/CreateChannelRequest');
const readChannelSchema = require('../requests/Channel/ReadChannelRequest');
const listUserChannelsSchema = require('../requests/Channel/ListUserChannelsRequest');
const updateChannelSchema = require('../requests/Channel/UpdateChannelRequest');
const deleteChannelSchema = require('../requests/Channel/DeleteChannelRequest');
const addMemberSchema = require('../requests/Channel/AddMemberRequest');
const removeMemberSchema = require('../requests/Channel/RemoveMemberRequest');

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

router.get('/list-by-user', 
    validate(listUserChannelsSchema), 
    channelExist, 
    channelController.listByUser
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
