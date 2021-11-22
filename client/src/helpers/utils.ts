import axios from 'axios';
import { isEmpty, isNil, sortBy } from 'lodash';
import moment from 'moment';
import { ITask, Order } from 'stores/task/Reducer';

export const isValidEmail = (email: string) => {
  const regexForEmailValidation =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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

export const isEmail = (email: string) => {
  const emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return emailRegex.test(email);
};

export const toTitleCase = (phrase) => {
  return phrase
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const flattenObject = function (ob) {
  const toReturn = {};

  for (const i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if (typeof ob[i] == 'object') {
      const flatObject = flattenObject(ob[i]);
      for (const x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + '.' + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
};

export const compareObjects = (o1, o2) => {
  var k = '';
  for (k in o1) if (o1[k] != o2[k]) return false;
  for (k in o2) if (o1[k] != o2[k]) return false;
  return true;
};

export function itemExists(haystack, needle) {
  for (var i = 0; i < haystack.length; i++)
    if (compareObjects(haystack[i], needle)) return true;
  return false;
}

export const getUniqueList = (a, field) => {
  let result: any = [];
  a.forEach((item) => {
    if (
      !itemExists(result, {
        id: item[field]._id,
        label: item[field].name,
      })
    )
      result.push({
        id: item[field]._id,
        label: item[field].name,
      });
  });
  return result;
};

export const flatObject = (obj) => {
  const flatObject = {};
  const path: any[] = []; // current path

  function dig(obj) {
    if (obj !== Object(obj))
      /*is primitive, end of path*/
      return (flatObject[path.join('.')] = obj); /*<- value*/

    //no? so this is an object with keys. go deeper on each key down
    for (let key in obj) {
      path.push(key);
      dig(obj[key]);
      path.pop();
    }
  }

  dig(obj);
  return flatObject;
};

export const globalFilterFn = (tasks, filterValue) => {
  let results: any = [];

  for (let i = 0; i < tasks.length; i++) {
    const flattenTask = flatObject(tasks[i]);
    for (const key in flattenTask) {
      if (
        key !== '_id' &&
        flattenTask[key]
          .toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      ) {
        if (!itemExists(results, tasks[i])) results.push(tasks[i]);
      }
    }
  }
  return results;
};

export const tasksFilterFn = (
  tasks,
  globalFilter: string | undefined,
  selectedDueDateOption: string,
  selectedDueDateRange: [null | Date, null | Date],
  selectedStatusList: string[],
  selectedLabelList: string[],
  selectedProjectList?: string[] | undefined,
) => {
  if (!isNil(globalFilter) || !isEmpty(globalFilter)) {
    tasks = globalFilterFn(tasks, globalFilter);
  }
  if (
    !isNil(selectedDueDateOption) &&
    !isEmpty(selectedDueDateOption)
  ) {
    tasks = tasks.filter((task) => {
      const rowYear = new Date(task.dueDate).getFullYear();
      const rowMonth = new Date(task.dueDate).getMonth();
      const rowDate = new Date(task.dueDate).getDate();

      const startOfWeek = moment().startOf('week').toISOString();
      const endOfWeek = moment().endOf('week').toISOString();

      if (
        selectedDueDateOption === 'range' &&
        selectedDueDateRange[0] &&
        selectedDueDateRange[1]
      ) {
        return (
          task.dueDate > selectedDueDateRange[0].toISOString() &&
          task.dueDate < selectedDueDateRange[1].toISOString()
        );
      } else if (selectedDueDateOption === 'passed') {
        return task.dueDate < new Date().toISOString();
      } else if (selectedDueDateOption === 'today') {
        const today = new Date();

        return (
          rowYear === today.getFullYear() &&
          rowMonth === today.getMonth() &&
          rowDate === today.getDate()
        );
      } else if (selectedDueDateOption === 'tomorrow') {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return (
          rowYear === tomorrow.getFullYear() &&
          rowMonth === tomorrow.getMonth() &&
          rowDate === tomorrow.getDate()
        );
      } else if (selectedDueDateOption === 'week') {
        return task.dueDate > startOfWeek && task.dueDate < endOfWeek;
      } else return task;
    });
  }
  if (!isNil(selectedProjectList) && !isEmpty(selectedProjectList)) {
    tasks = filterTasksByProject(tasks, selectedProjectList);
  }

  if (!isNil(selectedStatusList) && !isEmpty(selectedStatusList)) {
    tasks = filterTasksByStatus(tasks, selectedStatusList);
  }
  return tasks;
};

export const filterTasksByStatus = (tasks, selectedStatusList) => {
  return tasks.filter((task) =>
    selectedStatusList.includes(task.status._id),
  );
};

export const filterTasksByProject = (tasks, selectedProjectList) => {
  return tasks.filter((task) =>
    selectedProjectList.includes(task.project._id),
  );
};

export const formatTasksForCalendar = (projectTaskList) => {
  return projectTaskList.map((t: any) => ({
    title: t.name,
    start: new Date(t.createdAt),
    end: new Date(t.dueDate),
    allDay: true,
    redirectTo: `/company/${t.company.uniqueName}/project/${t.project._id}/task/${t._id}`,
    priority: t.priority,
  }));
};

// const tempStatuses = taskList.map((task) => task.status);
// const uniqueStatuses: ITaskStatus[] = [];
// tempStatuses.forEach((status) => {
//   if (uniqueStatuses.length === 0) {
//     uniqueStatuses.push(status);
//   } else {
//     const isExist = uniqueStatuses.some((item) => {
//       return item._id === status._id;
//     });
//     if (!isExist) {
//       uniqueStatuses.push(status);
//     }
//   }
// });
// setStatues(uniqueStatuses);
