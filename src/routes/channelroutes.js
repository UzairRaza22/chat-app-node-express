const express = require('express');
const router = express.Router();

const channelController = require('../controllers/channelcontroller');
const { validate } = require('../middlewares/responsehandlermiddleware');
const auth = require('../middlewares/auth/checktokenmiddleware');

const channelExist = require('../middlewares/channel/checkchannelexistmiddleware');
const channelCreate = require('../middlewares/channel/checkchannelcreatemiddleware');
const memberCheck = require('../middlewares/channel/membercheckmiddleware');
const channelAdmin = require('../middlewares/channel/checkchanneladminmiddleware');
const channelAddMember = require('../middlewares/channel/checkchanneladdmembermiddleware');
const channelRemoveMember = require('../middlewares/channel/checkchannelremovemembermiddleware');

const createChannelSchema = require('../requests/channel/createchannelrequest');
const readChannelSchema = require('../requests/channel/readchannelrequest');
const updateChannelSchema = require('../requests/channel/updatechannelrequest');
const deleteChannelSchema = require('../requests/channel/deletechannelrequest');
const addMemberSchema = require('../requests/channel/addmemberrequest');
const removeMemberSchema = require('../requests/channel/removememberrequest');

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

