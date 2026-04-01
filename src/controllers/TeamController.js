const Team = require('/TeamModel');
const User = require('/UserModel'); 
const TeamResource = require('/TeamResource');
const { asyncHandler } = require('/ResponseHandlerMiddleware');


//Create
const create = asyncHandler(async (req, res) => {
    const { workspace_id, name, description } = req.validatedData;

    const team = await Team.create({
        workspace_id,
        name,
        description,
        creator_id: req.user._id,
        members: [req.user._id]
    });

    await User.findByIdAndUpdate(req.user._id, { $addToSet: { teams: team._id } });

    res.success({
        message: 'Team created successfully.',
        data: TeamResource.make(team)
    }, 201);
});

//  read team
const read = asyncHandler(async (req, res) => {
    res.success({
        message: 'Team retrieved successfully.',
        data: TeamResource.make(req.team)
    });
});

//  Update 
const update = asyncHandler(async (req, res) => {
    const updatePayload = req.updatePayload;

    Object.assign(req.team, updatePayload);
    await req.team.save();

    res.success({
        message: 'Team updated successfully.',
        data: TeamResource.make(req.team)
    });
});

 //  Delete 
const deleteTeam = asyncHandler(async (req, res) => {
    await User.updateMany(
        { teams: req.team._id },
        { $pull: { teams: req.team._id } }
    );

    await req.team.deleteOne();

    res.success({
        message: 'Team deleted successfully.'
    });
});

  // Add members 
const addMember = asyncHandler(async (req, res) => {
    const { members } = req.validatedData;

    const team = await Team.findByIdAndUpdate(
        req.team._id,
        { $addToSet: { members: { $each: members } } },
        { new: true }
    );

    await User.updateMany(
        { _id: { $in: members } },
        { $addToSet: { teams: req.team._id } }
    );

    res.success({
        message: 'Members added successfully.',
        data: TeamResource.make(team)
    });
});
   
// Remove members
const removeMember = asyncHandler(async (req, res) => {
    const { members } = req.validatedData;

    const team = await Team.findByIdAndUpdate(
        req.team._id,
        { $pullAll: { members } },
        { new: true }
    );

    await User.updateMany(
        { _id: { $in: members } },
        { $pull: { teams: req.team._id } }
    );

    res.success({
        message: 'Members removed successfully.',
        data: TeamResource.make(team)
    });
});

module.exports = {
    create,
    read,
    update,
    deleteTeam,
    addMember,
    removeMember
};
