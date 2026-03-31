const Team = require('../Models/TeamModel');
const TeamResource = require('../resources/TeamResource');
const { asyncHandler } = require('../Middlewares/CheckValidationMiddleware');


const create = asyncHandler(async (req, res) => {
    const { workspace_id, name, description } = req.validatedData;

    const team = await Team.create({
        workspace_id,
        name,
        description,
        creator_id: req.user._id,
        members: [req.user._id]
    });

    res.status(201).json({
        message: 'Team created successfully.',
        data: TeamResource.make(team)
    });
});

const read = asyncHandler(async (req, res) => {
    res.json({
        message: 'Team retrieved successfully.',
        data: TeamResource.make(req.team)
    });
});


const update = asyncHandler(async (req, res) => {
    const updatePayload = req.updatePayload;

    Object.assign(req.team, updatePayload);
    await req.team.save();

    res.json({
        message: 'Team updated successfully.',
        data: TeamResource.make(req.team)
    });
});

const deleteTeam = asyncHandler(async (req, res) => {
    await req.team.deleteOne();

    res.json({
        message: 'Team deleted successfully.'
    });
});

const addMember = asyncHandler(async (req, res) => {
    const { members } = req.validatedData;

    await Team.findByIdAndUpdate(
        req.team._id,
        { $addToSet: { members: { $each: members } } }
    );

    const updated = await Team.findById(req.team._id);

    res.json({
        message: 'Members added successfully.',
        data: TeamResource.make(updated)
    });
});

const removeMember = asyncHandler(async (req, res) => {
    const { members } = req.validatedData;

    await Team.findByIdAndUpdate(
        req.team._id,
        { $pullAll: { members } }
    );

    const updated = await Team.findById(req.team._id);

    res.json({
        message: 'Members removed successfully.',
        data: TeamResource.make(updated)
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
