import axios from 'axios';
import { sortBy } from 'lodash';
import { ITask, Order } from 'stores/task/Reducer';

export const isValidEmail = (email: string) => {
  const regexForEmailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regexForEmailValidation)) {
    return true;
  } return false;
};

export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const getLocation = async () => {
  const data = await axios.get('https://extreme-ip-lookup.com/json/');
  return data;
};

export const sortTasksByStatus = (tasks: any) => {
  const primaryStatus = ['in-progress', 'to-do', 'done'];
  const sortedTasks = sortBy(tasks, (task) => {
    const rank = {
      'in-progress': 2,
      'to-do': 1,
      other: 3,
      done: 999,
    };
    return primaryStatus.includes(task.status)
      ? rank[task.status]
      : rank.other;
  });
  return sortedTasks;
};

export const sortTasksByDueDate = (
  tasks: ITask[],
  orderBy: Order,
) => tasks.sort((a: ITask, b: ITask) => {
  if (a.dueDate! < b.dueDate!) return orderBy === 'asc' ? 1 : -1;
  if (a.dueDate! > b.dueDate!) return orderBy === 'asc' ? -1 : 1;
  return 0;
});

export const sortTasksByPriority = (
  tasks: ITask[],
  orderBy: Order,
) => tasks.sort((a: ITask, b: ITask) => (orderBy === 'asc'
  ? a.priority - b.priority
  : b.priority - a.priority));

export const compareChats = (a: any, b: any) => {
  if (a.message.createdAt < b.message.createdAt) return 1;
  if (a.message.createdAt > b.message.createdAt) return -1;
  return 0;
};

export const sortProjectsByDeadline = (projects: any) => {
  // console.log(projects);
  projects.sort((a: any, b: any) => a.deadline - b.deadline);
};

export const sortProjectsByStatus = (projects: any) => {
  // console.log(projects);
};

export const sortProjectsByTasksRemaining = (projects: any) => {
  // console.log(projects);
};

export const msToTime = (s: number) => {
  const pad = (n: number, z = 2) => (`00${n}`).slice(-z);
  return (
    // eslint-disable-next-line no-bitwise
    `${pad((s / 3.6e6) | 0)
    }:${
      // eslint-disable-next-line no-bitwise
      pad(((s % 3.6e6) / 6e4) | 0)
    }:${
      // eslint-disable-next-line no-bitwise
      pad(((s % 6e4) / 1000) | 0)}`
  );
};
