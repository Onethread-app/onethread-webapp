const TaskStatus = require('../../../task/taskStatus/taskStatus.model');

const createTaskStatus = async (name, project, index, account) => {
  return TaskStatus.create({
    name,
    project,
    positionInBoard: index,
    account,
  });
};

const createBulkTaskStatus = async (statusList, project, account) => {
  await Promise.all(
    statusList.map(async (status) => {
      await TaskStatus.create({
        name: status.name,
        project,
        positionInBoard: status.positionInBoard,
        color: status.color,
        account,
      });
    }),
  );
};

const getAllStatusInProject = async (project) => {
  return TaskStatus.find({ project });
};

module.exports = {
  createTaskStatus,
  getAllStatusInProject,
  createBulkTaskStatus,
};
