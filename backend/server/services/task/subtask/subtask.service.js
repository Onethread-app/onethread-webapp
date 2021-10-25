const SubTask = require('../../../task/subtask/subtask.model');

const findSubtasksByTaskId = async (taskId) => {
  return SubTask.find({
    taskId: taskId,
  })
    .select('-updatedAt')
    .populate([
      {
        path: 'assignedMembers',
        select: '_id firstName lastName profileImage',
      },
    ]);
};

module.exports = {
  findSubtasksByTaskId,
};
