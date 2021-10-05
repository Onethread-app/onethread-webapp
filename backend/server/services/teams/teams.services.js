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
];
const teamMemberListFindByProjectId = async (pid) => {
  return await Team.find({ project: pid })
    .select('member')
    .populate(options)
    .exec();
};
module.exports = {
  teamMemberListFindByProjectId,
};
