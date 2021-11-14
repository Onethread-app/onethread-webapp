const TaskStatus = require('../../../task/taskStatus/taskStatus.model');

const createTaskStatus = async (name, project, index, account) => {
  return TaskStatus.create({
    name,
    project,
    positionInBoard: index,
    account,
  });
};

const getAllStatusInProject = async (project) => {
  const statues = await TaskStatus.find({ project });
  return statues;
};

module.exports = {
  createTaskStatus,
  getAllStatusInProject,
};
