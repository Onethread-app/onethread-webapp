const subtaskPopulateOptions = [
  {
    path: 'taskId',
    select: '_id name project dueDate status',
    populate: [
      {
        path: 'project',
        select: '_id name',
        populate: [
          {
            path: 'company',
            select: '_id uniqueName',
          },
        ],
      },
    ],
  },
  {
    path: 'account',
    select: '_id firstName lastName',
  },
  {
    path: 'assignedPerson',
    select: '_id firstName lastName',
  },
];

const subtaskPopulateOptionsForUser = [
  {
    path: 'taskId',
    select: '_id name project dueDate status',
    populate: [
      {
        path: 'project',
        select: '_id name',
        populate: [
          {
            path: 'company',
            select: '_id uniqueName',
          },
        ],
      },
    ],
  },
];

module.exports = {
  subtaskPopulateOptions,
  subtaskPopulateOptionsForUser,
};
