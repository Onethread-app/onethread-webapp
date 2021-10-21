const Task = require('../../task/task.model');
const TaskAssign = require('../../task/taskAssign.model');

const taskAssignOptions = [
  {
    path: 'taskId',
    select: '_id name boardId columnId project',
    populate: [
      {
        path: 'project',
        select: '_id',
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
];
const findTaskById = async (_id) => {
  return Task.findById(id).select('name boardId project');
};
const findTaskMembersById = async (_id) => {
  return TaskAssign.findById(_id).populate(taskAssignOptions);
};
module.exports = {
  findTaskById,
  findTaskMembersById,
};
