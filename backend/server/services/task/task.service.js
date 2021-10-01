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
  return await Task.findById({ _id: _id })
    .select('name boardId project')
    .exec();
};
const findTaskMembersById = async (_id) => {
  return await TaskAssign.findById({
    _id: _id,
  })
    .populate(taskAssignOptions)
    .exec();
};
module.exports = {
  findTaskById,
  findTaskMembersById,
};
