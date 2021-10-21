const _ = require('lodash');

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

module.exports = {
  sortTasksByStatus,
  sortProjectsByStatus,
};
