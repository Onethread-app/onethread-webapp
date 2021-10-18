import { createContext, Dispatch, useContext } from 'react';
import { ITask } from 'stores/task/Reducer';

type ICompanyTasksContext = {
  tasks: ITask[];
  selectedStatusList: string[];
  selectedProjectList: string[];
  selectedDueDateOption: string;
  selectedDueDateRange: [null | Date, null | Date];
  setSelectedStatusList: Dispatch<any>;
  setSelectedProjectList: Dispatch<any>;
  setSelectedDueDateOption: Dispatch<any>;
  setSelectedDueDateRange: Dispatch<[null | Date, null | Date]>;
};

export const CompanyTasksContext =
  createContext<ICompanyTasksContext>({
    tasks: [],
    selectedStatusList: [],
    selectedProjectList: [],
    selectedDueDateOption: '',
    selectedDueDateRange: [null, null],
    setSelectedStatusList: () => {},
    setSelectedProjectList: () => {},
    setSelectedDueDateOption: () => {},
    setSelectedDueDateRange: () => {},
  });

export const useCompanyTasksContext = () =>
  useContext(CompanyTasksContext);
