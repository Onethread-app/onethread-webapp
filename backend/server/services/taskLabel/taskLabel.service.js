const TaskLabel = require('../../label/taskLabel.model');

const getTaskLabel = async (taskId) => {
  const labels = await TaskLabel.find({ task: taskId }).populate([
    {
      path: 'label',
      select: '_id name color',
    },
  ]);
  return labels.map((label) => label.label);
};

const taskLabelCreation = async (task, label) => {
  return TaskLabel.create({ task, label });
};

module.exports = {
  getTaskLabel,
  taskLabelCreation,
};
