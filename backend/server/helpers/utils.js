const _ = require('lodash');

// const { getTaskMembers } = require('../task/task.controller');
const TaskAssign = require('../task/taskAssign.model');
const {
  findSubtasksByTaskId,
} = require('../services/task/task.service');

const getTaskMembers = async (taskId) => {
  const taskMembers = await TaskAssign.find({
    taskId,
  })
    .select('_id assignedPerson')
    .populate([
      {
        path: 'assignedPerson',
        select: '_id firstName lastName profileImage',
      },
    ])
    .exec();
  return taskMembers;
};

const sortTasksByStatus = (tasks) => {
  const primaryStatus = ['in-progress', 'to-do', 'done'];
  const rank = {
    'in-progress': 0,
    'to-do': 1,
    other: 3,
    done: 999,
  };

  const sortedTasks = _.sortBy(tasks, (task) => {
    return primaryStatus.includes(task.status)
      ? rank[task.status]
      : rank['other'];
  });
  _.sortBy(sortedTasks, (task) => {
    return new Date(task.dueDate);
  });

  return sortedTasks;
};

const sortProjectsByStatus = (projects) => {
  const rank = {
    ongoing: 0,
    'not-started': 1,
    completed: 2,
  };
  return _.sortBy(projects, (project) => {
    return rank[project.status];
  });
};

const getFormattedTaskForClient = async (tasks) => {
  const formattedTasks = [];
  for (let i = 0; i < tasks.length; i += 1) {
    const task = tasks[i];
    const subtasks = await findSubtasksByTaskId(task._id);
    const taskMembers = await getTaskMembers(task._id);
    const members = taskMembers.map((tMember) => {
      return tMember.assignedPerson;
    });

    const formattedTask = {
      ...task._doc,
      subtasks,
      members,
    };
    formattedTasks.push(formattedTask);
  }
  return formattedTasks;
};

module.exports = {
  sortTasksByStatus,
  sortProjectsByStatus,
  getFormattedTaskForClient,
  getTaskMembers,
};
