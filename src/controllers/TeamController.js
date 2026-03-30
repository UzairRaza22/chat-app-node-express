const Team = require('../Models/TeamModel');
const TeamResource = require('../Resources/TeamResource');
const { asyncHandler } = require('../Middlewares/CheckValidationMiddleware');

/**
 * @desc    Create a new team
 * @route   POST /api/teams/create
 */
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

/**
 * @desc    Get team details
 * @route   GET /api/teams/read
 */
const read = asyncHandler(async (req, res) => {
    res.json({
        message: 'Team retrieved successfully.',
        data: TeamResource.make(req.team)
    });
});

/**
 * @desc    Update a team
 * @route   PUT /api/teams/update
 */
const update = asyncHandler(async (req, res) => {
    const updatePayload = req.updatePayload;

    Object.assign(req.team, updatePayload);
    await req.team.save();

    res.json({
        message: 'Team updated successfully.',
        data: TeamResource.make(req.team)
    });
});

/**
 * @desc    Delete a team
 * @route   DELETE /api/teams/delete
 */
const deleteTeam = asyncHandler(async (req, res) => {
    await req.team.deleteOne();

    res.json({
        message: 'Team deleted successfully.'
    });
});

/**
 * @desc    Add members to a team
 * @route   POST /api/teams/add-member
 */
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

/**
 * @desc    Remove members from a team
 * @route   DELETE /api/teams/remove-member
 */
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
