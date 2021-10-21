const { Company } = require('../../company/company.model');
const Task = require('../../task/task.model');
const Subtask = require('../../task/subtask/subtask.model');

const companyListFinder = async () => {
  const companyIdList = await Company.find({}).select('_id').exec();
  return companyIdList;
};

const findCompanyById = async (_id) => {
  return Company.findById(id);
};

const findCompanyNameByTask = async (taskId) => {
  const task = await Task.findById(taskId).populate(
    'project',
    'company',
  );
  const company = await Company.findById(task.project.company).select(
    'uniqueName',
  );
  return company.uniqueName;
};

const findCompanyNameBySubtask = async (subtaskId) => {
  const subtask = await Subtask.findById(subtaskId).populate(
    'task',
    '_id',
  );

  return findCompanyNameByTask(subtask.task._id);
};

module.exports = {
  companyListFinder,
  findCompanyById,
  findCompanyNameByTask,
  findCompanyNameBySubtask,
};
