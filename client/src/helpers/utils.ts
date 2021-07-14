import axios from 'axios';
import { sortBy } from 'lodash';

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

export const sortTasks = (tasks: any) => {
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

export const compareChats = (a: any, b: any) => {
  if (a.message.createdAt < b.message.createdAt) return 1;
  else if (a.message.createdAt > b.message.createdAt) return -1;
  else return 0;
};
