import { createContext, Dispatch, useContext } from 'react';
import { ITask } from 'stores/task/Reducer';

export type ITasksTableContext = {
  globalFilter: string | undefined;
  tasks: ITask[];
  selectedStatusList: string[];
  selectedLabelList: string[];
  selectedAssigneeList: string[];
  selectedProjectList?: string[];
  selectedDueDateOption: string;
  selectedDueDateRange: [null | Date, null | Date];
  setSelectedStatusList: Dispatch<any>;
  setSelectedLabelList: Dispatch<any>;
  setSelectedAssigneeList: Dispatch<any>;
  setSelectedProjectList?: Dispatch<any>;
  setSelectedDueDateOption: Dispatch<any>;
  setSelectedDueDateRange: Dispatch<[null | Date, null | Date]>;
};

export const TasksTableContext = createContext<ITasksTableContext>({
  globalFilter: undefined,
  tasks: [],
  selectedStatusList: [],
  selectedLabelList: [],
  selectedAssigneeList: [],
  selectedProjectList: [],
  selectedDueDateOption: '',
  selectedDueDateRange: [null, null],
  setSelectedStatusList: () => {},
  setSelectedLabelList: () => {},
  setSelectedAssigneeList: () => {},
  setSelectedProjectList: () => {},
  setSelectedDueDateOption: () => {},
  setSelectedDueDateRange: () => {},
});

export const useTasksTableContext = () =>
  useContext(TasksTableContext);
