const TaskAssign = require('../../task/taskAssign.model');

const populateOptions = [
  {
    path: 'taskId',
    select:
      '_id name account project dueDate status priority createdAt isCompleted parentTask',
    populate: [
      {
        path: 'project',
        select: '_id name',
        populate: [
          {
            path: 'company',
            select: '_id uniqueName name',
          },
        ],
      },
      {
        path: 'status',
        select: '_id name',
      },
      {
        path: 'account',
        select: '_id firstName lastName profileImage',
      },
    ],
  },
  {
    path: 'account',
    select: '_id firstName lastName profileImage',
  },
  {
    path: 'assignedPerson',
    select: '_id firstName lastName',
  },
];

const findTaskAssignedByUser = async (
  assignedPerson,
  limit = 50,
  skip = 0,
  options = populateOptions,
) => {
  return TaskAssign.find({ assignedPerson })
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .select('taskId')
    .populate(options);
};

module.exports = {
  findTaskAssignedByUser,
};
