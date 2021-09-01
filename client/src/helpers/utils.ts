import axios from 'axios';
import { sortBy } from 'lodash';
import { ITask, Order } from 'stores/board/Reducer';

export const isValidEmail = (email: string) => {
  const regexForEmailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regexForEmailValidation)) {
    return true;
  } else return false;
};

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getLocation = async () => {
  const data = await axios.get('https://extreme-ip-lookup.com/json/');
  return data;
};

export const sortTasksByStatus = (tasks: any) => {
  const sortedTasks = sortBy(tasks, (task) => {
    const rank = {
      'in-progress': 1,
      'to-do': 2,
      done: 3,
    };
    return rank[task.taskId.status];
  });
  return sortedTasks;
};

export const sortTasksByDueDate = (
  tasks: ITask[],
  orderBy: Order,
) => {
  return tasks.sort((a: ITask, b: ITask) => {
    if (a.dueDate! < b.dueDate!) return orderBy === 'asc' ? 1 : -1;
    else if (a.dueDate! > b.dueDate!)
      return orderBy === 'asc' ? -1 : 1;
    else return 0;
  });
};

export const sortTasksByPriority = (
  tasks: ITask[],
  orderBy: Order,
) => {
  return tasks.sort((a: ITask, b: ITask) =>
    orderBy === 'asc'
      ? a.priority - b.priority
      : b.priority - a.priority,
  );
};

export const compareChats = (a: any, b: any) => {
  if (a.message.createdAt < b.message.createdAt) return 1;
  else if (a.message.createdAt > b.message.createdAt) return -1;
  else return 0;
};

export const sortProjectsByDeadline = (projects: any) => {
  // console.log(projects);
  projects.sort((a: any, b: any) => {
    console.log(a.deadline, b.deadline);
    return a.deadline - b.deadline;
  });
};

export const sortProjectsByStatus = (projects: any) => {
  // console.log(projects);
};

export const sortProjectsByTasksRemaining = (projects: any) => {
  // console.log(projects);
};

export const msToTime = (s: number) => {
  const pad = (n: number, z = 2) => ('00' + n).slice(-z);
  return (
    pad((s / 3.6e6) | 0) +
    ':' +
    pad(((s % 3.6e6) / 6e4) | 0) +
    ':' +
    pad(((s % 6e4) / 1000) | 0)
  );
};
