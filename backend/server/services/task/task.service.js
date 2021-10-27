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

const getAssignedMembers = async (taskId) => {
  return TaskAssign.find({ taskId })
    .select('_id assignedPerson account')
    .populate([
      {
        path: 'assignedPerson account',
        select: '_id firstName lastName profileImage',
      },
    ]);
};

const findTodaysTask = async (isCompleted = undefined) => {
  let startToday = new Date();
  startToday.setHours(0, 0, 0, 0);
  let endToday = new Date();
  endToday.setHours(23, 59, 59, 999);
  let query = {
    dueDate: { $gte: startToday, $lt: endToday },
    parentTask: null,
  };
  if (typeof isCompleted === 'boolean') {
    query.isCompleted = isCompleted;
  }
  return Task.find(query);
};

const findAssignedNumberOfTasks = async (taskId, assignedPerson) => {
  return TaskAssign.find({
    taskId,
    assignedPerson,
  }).countDocuments();
};

const findSubtasksByTaskId = async (
  parentTask,
  populateArray = [],
) => {
  let subtasks = await Task.find({ parentTask })
    .select('-updatedAt')
    .populate(populateArray);

  console.log(subtasks);
  let subtaskWithMembers = [];
  await Promise.all(
    subtasks.map(async (subtask) => {
      const st = subtask.toJSON();
      st.members = await getAssignedMembers(st._id);
      subtaskWithMembers.push(st);
    }),
  );
  return subtaskWithMembers;
};

module.exports = {
  findTaskById,
  findTaskMembersById,
  getAssignedMembers,
  findSubtasksByTaskId,
  findTodaysTask,
  findAssignedNumberOfTasks,
};
