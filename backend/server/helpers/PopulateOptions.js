const subtaskPopulateOptions = [
  {
    path: 'taskId',
    select: '_id name boardId columnId project dueDate status',
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
      {
        path: 'boardId',
        select: '_id',
      },
      {
        path: 'columnId',
        select: '_id',
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
    select: '_id name boardId columnId project dueDate status',
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
      {
        path: 'boardId',
        select: '_id',
      },
      {
        path: 'columnId',
        select: '_id',
      },
    ],
  },
];

module.exports = {
  subtaskPopulateOptions,
  subtaskPopulateOptionsForUser,
};
