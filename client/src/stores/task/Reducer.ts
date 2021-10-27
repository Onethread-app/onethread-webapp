import { TaskActionType } from './Types';
import { toggleOrderOnSort } from './Utils';

export type Order = 'asc' | 'desc';
export type SortTasksBy = 'priority' | 'dueDate' | undefined;

export interface IColumn {
  _id: string;
  name: string;
  positionInBoard: number;
  tasks?: ITask[];
}

export interface ITaskStatus {
  _id: string;
  name: string;
}

export interface IFile {
  _id: string;
  link: string;
  s3Key: string;
}

export interface ITaskMember {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
}

export interface IBoardMember {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  name: string;
}

export interface IFilterUser {
  id: string;
  label: string;
}

export interface TaskBoard {
  _id: string;
  name: string;
  department: string;
  color: string;
  columns: IColumn[];
  members: IBoardMember[];
  totalTasks: number;
  remainingTasks: number;
  sortBy: SortTasksBy;
  orderBy: Order;
  filteredUsers: IFilterUser[];
  preferredView?: 'board' | 'list';
}

export interface ITask {
  _id: string;
  name: string;
  description: string;
  createdAt: Date | null;
  createdBy: string;
  status: ITaskStatus;
  assignedMembers?: ITaskMember[];
  dueDate?: Date | null;
  priority: number;
  file?: IFile[];
  comments?: Object[];
  timeSpent: number;
  activityCount?: number;
  project: {
    _id: string;
    name: string;
  };
  company: {
    _id: string;
    name: string;
    uniqueName: string;
  };
  account: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
}

export interface IBoard {
  boardList: TaskBoard[];
  currentBoard: TaskBoard;
  currentTask: ITask;
  userTasks: ITask[];
  boardError: string;
  boardColumnError: string;
  boardTaskError: string;
  creatingBoard: boolean;
  creatingTask: boolean;
  fetchingBoards: boolean;
  fetchingBoard: boolean;
  fetchingColumn: boolean;
  fetchingTask: boolean;
  fetchingUserTasks: boolean;
  updatingColumn: boolean;
  updatingBoard: boolean;
  updatingBoardName: boolean;
  updatingTask: boolean;
  deletingTask: boolean;
  dragAndDrop: boolean;
  uploadingTaskFile: boolean;
  deletingTaskFile: boolean;
  taskError: string;
  errorOnCreatingTask: string;
  errorOnUpdatingBoardName: string;
  errorOnFetchingBoard: string;
  errorOnFetchingUserTasks: string;
  errorOnTaskDelete: string;
  errorOnUploadingTaskFile: string;
  errorOnTaskFileDelete: string;
}

export interface ITaskReducer {
  boardList: TaskBoard[];
  currentBoard: TaskBoard;
  currentTask: ITask;
  userTasks: ITask[];
  companyTaskList: ITask[];
  projectTaskList: ITask[];
  boardError: string;
  boardColumnError: string;
  boardTaskError: string;
  creatingBoard: boolean;
  creatingTask: boolean;
  fetchingBoards: boolean;
  fetchingBoard: boolean;
  fetchingColumn: boolean;
  fetchingTask: boolean;
  fetchingUserTasks: boolean;
  fetchingCompanyTasks: boolean;
  fetchingProjectTasks: boolean;
  updatingColumn: boolean;
  updatingBoard: boolean;
  updatingBoardName: boolean;
  updatingTask: boolean;
  deletingTask: boolean;
  dragAndDrop: boolean;
  uploadingTaskFile: boolean;
  deletingTaskFile: boolean;
  taskError: string;
  errorOnCreatingTask: string;
  errorOnUpdatingBoardName: string;
  errorOnFetchingBoard: string;
  errorOnFetchingUserTasks: string;
  errorOnTaskDelete: string;
  errorOnUploadingTaskFile: string;
  errorOnTaskFileDelete: string;
  errorOnFetchingProjectTasks: string;
  errorOnFetchingCompanyTasks: string;
}

const InitialState: ITaskReducer = {
  boardList: [] as any,
  currentBoard: {
    _id: '',
    name: '',
    columns: [],
    members: [],
    department: '',
    color: '',
    totalTasks: 0,
    remainingTasks: 0,
    sortBy: undefined,
    orderBy: 'asc' as const,
    filteredUsers: [],
    preferredView: 'list',
  },
  currentTask: {
    _id: '',
    name: '',
    description: '',
    createdAt: null,
    createdBy: '',
    status: {
      _id: '',
      name: '',
    },
    assignedMembers: [],
    dueDate: null,
    priority: 2,
    file: [],
    comments: [],
    company: {
      _id: '',
      name: '',
      uniqueName: '',
    },
    project: {
      _id: '',
      name: '',
    },
    account: {
      _id: '',
      firstName: '',
      lastName: '',
      profileImage: '',
    },
    timeSpent: 0,
  },
  userTasks: [],
  companyTaskList: [],
  projectTaskList: [],
  creatingBoard: false,
  creatingTask: false,
  fetchingBoards: false,
  fetchingBoard: false,
  fetchingColumn: false,
  fetchingTask: false,
  fetchingUserTasks: false,
  fetchingCompanyTasks: false,
  fetchingProjectTasks: false,
  updatingColumn: false,
  updatingBoard: false,
  updatingBoardName: false,
  updatingTask: false,
  deletingTask: false,
  dragAndDrop: false,
  uploadingTaskFile: false,
  deletingTaskFile: false,
  boardError: '',
  boardColumnError: '',
  boardTaskError: '',
  taskError: '',
  errorOnCreatingTask: '',
  errorOnUpdatingBoardName: '',
  errorOnFetchingBoard: '',
  errorOnFetchingUserTasks: '',
  errorOnTaskDelete: '',
  errorOnUploadingTaskFile: '',
  errorOnTaskFileDelete: '',
  errorOnFetchingCompanyTasks: '',
  errorOnFetchingProjectTasks: '',
};

export const TaskReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case TaskActionType.CREATE_BOARD_START:
      return {
        ...state,
        creatingBoard: true,
        boardError: '',
      };
    case TaskActionType.CREATE_BOARD_SUCCESS:
      return {
        ...state,
        boardList: [
          {
            _id: action.payload._id,
            name: action.payload.name,
            color: action.payload.color,
            department: action.payload.department,
            members: action.payload.members,
          },
          ...state.boardList,
        ],
        creatingBoard: false,
      };
    case TaskActionType.CREATE_BOARD_FAILURE:
      return {
        ...state,
        creatingBoard: false,
        boardError: action.payload,
      };
    case TaskActionType.GET_ALL_BOARDS_START:
      return {
        ...state,
        boardError: '',
        fetchingBoards: true,
      };
    case TaskActionType.GET_ALL_BOARDS_SUCCESS:
      return {
        ...state,
        boardList: action.payload,
        boardError: '',
        fetchingBoards: false,
      };
    case TaskActionType.GET_ALL_BOARDS_FAILURE:
      return {
        ...state,
        boardError: action.payload,
        fetchingBoards: false,
      };
    case TaskActionType.GET_ALL_USER_TASKS_START:
      return {
        ...state,
        fetchingUserTasks: true,
        errorOnFetchingUserTasks: '',
      };
    case TaskActionType.GET_ALL_USER_TASKS_SUCCESS:
      return {
        ...state,
        userTasks: action.payload,
        fetchingUserTasks: false,
      };
    case TaskActionType.GET_ALL_USER_TASKS_FAILURE:
      return {
        ...state,
        errorOnFetchingUserTasks: action.payload,
        fetchingUserTasks: false,
      };
    case TaskActionType.GET_ALL_TASKS_FOR_COMPANY_START:
      return {
        ...state,
        fetchingCompanyTasks: true,
        errorOnFetchingCompanyTasks: '',
      };
    case TaskActionType.GET_ALL_TASKS_FOR_COMPANY_SUCCESS:
      return {
        ...state,
        fetchingCompanyTasks: false,
        companyTaskList: action.payload,
      };
    case TaskActionType.GET_ALL_TASKS_FOR_COMPANY_FAILURE:
      return {
        ...state,
        fetchingCompanyTasks: false,
        errorOnFetchingCompanyTasks: action.payload,
      };
    case TaskActionType.GET_ALL_TASKS_FOR_PROJECT_START:
      return {
        ...state,
        fetchingProjectTasks: true,
        errorOnFetchingProjectTasks: '',
      };
    case TaskActionType.GET_ALL_TASKS_FOR_PROJECT_SUCCESS:
      return {
        ...state,
        projectTaskList: action.payload,
        fetchingProjectTasks: false,
      };
    case TaskActionType.GET_ALL_TASKS_FOR_PROJECT_FAILURE:
      return {
        ...state,
        errorOnFetchingProjectTasks: action.payload,
        fetchingProjectTasks: false,
      };
    case TaskActionType.SELECT_BOARD_START:
      return {
        ...state,
        errorOnFetchingBoard: '',
        fetchingBoard: true,
      };
    case TaskActionType.SELECT_BOARD_SUCCESS:
      return {
        ...state,
        currentBoard: action.payload,
        fetchingBoard: false,
      };
    case TaskActionType.SELECT_BOARD_FAILURE:
      return {
        ...state,
        errorOnFetchingBoard: action.payload,
        fetchingBoard: false,
      };
    case TaskActionType.UPDATE_BOARD_NAME_START:
      return {
        ...state,
        updatingBoardName: true,
        errorOnUpdatingBoardName: '',
      };
    case TaskActionType.UPDATE_BOARD_NAME_SUCCESS:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          name: action.payload.name,
        },
        updatingBoardName: false,
      };
    case TaskActionType.UPDATE_BOARD_NAME_FAILURE:
      return {
        ...state,
        errorOnUpdatingBoardName: action.payload,
        updatingBoardName: false,
      };
    case TaskActionType.ADD_TEAM_MEMBER_IN_BOARD_START:
      return {
        ...state,
        updatingBoard: true,
        boardError: '',
      };
    case TaskActionType.ADD_TEAM_MEMBER_IN_BOARD_SUCCESS:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          members: action.payload,
        },
        updatingBoard: false,
      };
    case TaskActionType.ADD_TEAM_MEMBER_IN_BOARD_FAILURE:
      return {
        ...state,
        updatingBoard: false,
        boardError: action.payload,
      };
    case TaskActionType.CREATE_COLUMN_START:
      return {
        ...state,
        fetchingColumn: true,
      };
    case TaskActionType.CREATE_COLUMN_SUCCESS:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columns: [...state.currentBoard.columns, action.payload],
        },
        fetchingColumn: false,
      };
    case TaskActionType.CREATE_COLUMN_FAILURE:
      return {
        ...state,
        boardColumnError: action.payload,
        fetchingColumn: false,
      };
    case TaskActionType.UPDATE_COLUMN_START:
      return {
        ...state,
        updatingColumn: true,
      };
    case TaskActionType.UPDATE_COLUMN_SUCCESS:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columns: state.currentBoard.columns.map(
            (column: IColumn, i) =>
              column._id === action.payload._id
                ? {
                    ...column,
                    name: action.payload.name,
                  }
                : column,
          ),
        },
        updatingColumn: false,
      };
    case TaskActionType.UPDATE_COLUMN_FAILURE:
      return {
        ...state,
        boardColumnError: action.payload,
        updatingColumn: false,
      };
    case TaskActionType.CREATE_TASK_START:
      return {
        ...state,
        creatingTask: true,
        errorOnCreatingTask: '',
      };
    case TaskActionType.CREATE_TASK_SUCCESS:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columns: state.currentBoard.columns.map(
            (column: IColumn, i) =>
              column._id === action.payload.columnId
                ? {
                    ...column,
                    tasks: [...column.tasks!, action.payload],
                  }
                : column,
          ),
        },
        creatingTask: false,
      };
    case TaskActionType.CREATE_TASK_FAILURE:
      return {
        ...state,
        errorOnCreatingTask: action.payload,
        creatingTask: false,
      };
    case TaskActionType.DRAG_AND_DROP_TASK_START:
      return {
        ...state,
        dragAndDrop: true,
      };
    case TaskActionType.DRAG_AND_DROP_TASK_SUCCESS:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columns: action.payload,
        },
        dragAndDrop: false,
      };
    case TaskActionType.DRAG_AND_DROP_TASK_FAILURE:
      return {
        ...state,
        dragAndDrop: false,
      };
    case TaskActionType.SELECT_TASK_START:
      return {
        ...state,
        taskError: '',
        fetchingTask: true,
      };
    case TaskActionType.SELECT_TASK_SUCCESS:
      return {
        ...state,
        currentTask: action.payload,
        fetchingTask: false,
      };
    case TaskActionType.SELECT_TASK_FAILURE:
      return {
        ...state,
        taskError: action.payload,
        fetchingTask: false,
      };
    case TaskActionType.UPDATE_TASK_START:
      return {
        ...state,
        updatingTask: true,
      };
    case TaskActionType.UPDATE_TASK_SUCCESS:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columns: action.payload.allColumns,
        },
        currentTask: action.payload.response,
        updatingTask: false,
      };
    case TaskActionType.UPDATE_TASK_FAILURE:
      return {
        ...state,
        taskError: action.payload,
        updatingTask: false,
      };
    case TaskActionType.UPDATE_TASK_TIME_SPENT:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columns: (state.currentBoard.columns as any).map(
            (column: IColumn) =>
              column._id === action.payload.column
                ? {
                    ...column,
                    tasks:
                      column.tasks && column.tasks.length > 0
                        ? column.tasks.map((task: ITask) =>
                            task._id === action.payload.task
                              ? {
                                  ...task,
                                  timeSpent:
                                    task.timeSpent +
                                    action.payload.duration,
                                }
                              : task,
                          )
                        : [],
                  }
                : column,
          ),
        },
        currentTask:
          action.payload.task === state.currentTask._id
            ? {
                ...state.currentTask,
                timeSpent:
                  state.currentTask.timeSpent +
                  action.payload.duration,
              }
            : state.currentTask,
      };
    case TaskActionType.TASK_FILE_UP_START:
      return {
        ...state,
        uploadingTaskFile: true,
        errorOnUploadingTaskFile: '',
      };
    case TaskActionType.TASK_FILE_UP_SUCCESS:
      return {
        ...state,
        // currentBoard: {
        //   ...state.currentBoard,
        //   columns: (state.currentBoard.columns as any).map(
        //     (column: IColumn) =>
        //       column._id === action.payload.columnId
        //         ? {
        //             ...column,
        //             tasks:
        //               column.tasks && column.tasks.length > 0
        //                 ? column.tasks.map((task: ITask) =>
        //                     task._id === action.payload.taskId
        //                       ? {
        //                           ...task,
        //                           file: [
        //                             ...task.file!,
        //                             {
        //                               _id: action.payload._id,
        //                               link: action.payload.link,
        //                               s3Key: action.payload.s3Key,
        //                             },
        //                           ],
        //                         }
        //                       : task,
        //                   )
        //                 : [],
        //           }
        //         : column,
        //   ),
        // },
        uploadingTaskFile: false,
      };
    case TaskActionType.TASK_FILE_UP_FAILURE:
      return {
        ...state,
        uploadingTaskFile: false,
        errorOnUploadingTaskFile: action.payload,
      };
    case TaskActionType.TASK_FILE_DELETE_START:
      return {
        ...state,
        deletingTaskFile: true,
        errorOnTaskFileDelete: '',
      };
    case TaskActionType.TASK_FILE_DELETE_SUCCESS:
      return {
        ...state,
        // currentBoard: {
        //   ...state.currentBoard,
        //   columns: (state.currentBoard.columns as any).map(
        //     (column: IColumn) =>
        //       column._id === action.payload.columnId
        //         ? {
        //             ...column,
        //             tasks:
        //               column.tasks && column.tasks.length > 0
        //                 ? column.tasks.map((task: ITask) =>
        //                     task._id === action.payload.taskId
        //                       ? {
        //                           ...task,
        //                           file: task.file
        //                             ? task.file.filter(
        //                                 (f) =>
        //                                   f._id !==
        //                                   action.payload.fileId,
        //                               )
        //                             : task.file,
        //                         }
        //                       : task,
        //                   )
        //                 : [],
        //           }
        //         : column,
        //   ),
        // },
        deletingTaskFile: false,
      };
    case TaskActionType.TASK_FILE_DELETE_FAILURE:
      return {
        ...state,
        errorOnTaskFileDelete: action.payload,
        deletingTaskFile: false,
      };
    case TaskActionType.DELETE_TASK_START:
      return {
        ...state,
        deletingTask: true,
        errorOnTaskDelete: '',
      };
    case TaskActionType.DELETE_TASK_SUCCESS:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columns: state.currentBoard.columns.map((column: IColumn) =>
            column._id === action.payload.columnId
              ? {
                  ...column,
                  tasks: column.tasks
                    ? column.tasks.filter(
                        (task) => task._id !== action.payload.taskId,
                      )
                    : column.tasks,
                }
              : column,
          ),
        },
        deletingTask: false,
      };
    case TaskActionType.DELETE_TASK_FAILURE: {
      return {
        ...state,
        deletingTask: false,
        errorOnTaskDelete: action.payload,
      };
    }
    case TaskActionType.CLEAR_CURRENT_BOARD: {
      return {
        ...state,
        currentBoard: {
          _id: '',
          name: '',
          description: '',
          columns: [],
          members: [],
        },
        currentTask: {},
      };
    }
    case TaskActionType.UPDATE_BOARD_LOADING:
      return {
        ...state,
        fetchingBoard: action.payload,
      };
    case TaskActionType.UPDATE_TASK_LOADING:
      return {
        ...state,
        fetchingTask: action.payload,
      };
    case TaskActionType.SET_SORT_BY:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          sortBy: action.payload,
          orderBy: toggleOrderOnSort(
            state.currentBoard.orderBy,
            state.currentBoard.sortBy,
            action.payload,
          ),
        },
      };
    case TaskActionType.SET_FILTER_USERS:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          filteredUsers: action.payload,
        },
      };
    case TaskActionType.SET_PREFERRED_VIEW:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          preferredView: action.payload,
        },
      };
    case TaskActionType.UPDATE_CURRENTTASK_COLUMNID:
      return {
        ...state,
        currentTask: {
          ...state.currentTask,
          columnId: action.payload.columnId,
          status: action.payload.status,
        },
      };
    case TaskActionType.CLEAR_COMPANY_TASKS:
      return {
        ...state,
        companyTaskList: [],
      };
    default:
      return state;
  }
};
