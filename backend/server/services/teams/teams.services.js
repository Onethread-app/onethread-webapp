const { Team } = require('../../team-member/team.model');
const logger = require('../../../config/winston');
const options = [
  {
    path: 'member',
    select: 'account',
    populate: [
      {
        path: 'account',
        select: '_id email',
      },
    ],
  },
  {
    path: 'project',
    select: '_id name status deadline createdAt',
  },
];

const teamMemberListFindByProjectId = async (pid) => {
  return await Team.find({ project: pid })
    .select('member')
    .populate(options)
    .exec();
};

const findAllProjectsByMemberId = async (id) => {
  return await Team.find({ member: id })
    .select('project isFavourite')
    .populate(options)
    .exec();
};

const findAllFavouriteProjectsByMemberId = async (id) => {
  return await Team.find({ member: id, isFavourite: true })
    .select('project isFavourite')
    .populate(options)
    .exec();
};

module.exports = {
  teamMemberListFindByProjectId,
  findAllProjectsByMemberId,
  findAllFavouriteProjectsByMemberId,
};
