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
    select: '-files',
    populate: [
      {
        path: 'associate',
        select: 'company associateCompany',
        populate: [
          {
            path: 'company',
            select: '_id',
          },
          {
            path: 'associateCompany',
            select: '_id',
          },
        ],
      },
      {
        path: 'company',
        select: '_id uniqueName',
      },
      {
        path: 'departments',
        select: 'name _id',
      },
      {
        path: 'concernedAdmin',
        select: 'name _id',
      },
    ],
  },
];

const favouriteProjectOptions = [
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
    select: '_id name color',
    populate: [
      {
        path: 'company',
        select: '_id uniqueName',
      },
    ],
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
    .populate(favouriteProjectOptions)
    .exec();
};

module.exports = {
  teamMemberListFindByProjectId,
  findAllProjectsByMemberId,
  findAllFavouriteProjectsByMemberId,
};
