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
  return TaskStatus.find({ project });
};

module.exports = {
  createTaskStatus,
  getAllStatusInProject,
};
