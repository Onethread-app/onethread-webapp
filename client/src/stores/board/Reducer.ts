import { BoardActionTypes } from './Types';

export interface IColumn {
  _id: string;
  name: string;
  positionInBoard: number;
  tasks?: ITask[];
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

export interface TaskBoard {
  _id: string;
  name: string;
  department: string;
  color: string;
  columns: IColumn[];
  members: IBoardMember[];
  totalTasks: number;
  remainingTasks: number;
}

export interface ITask {
  _id: string;
  name: string;
  description?: string;
  columnId: string;
  currentColumnName: string;
  createdAt: Date;
  createdBy: string;
  status: string;
  assignedMembers?: ITaskMember[];
  dueDate?: Date;
  priority: number;
  file?: IFile[];
  comments?: Object[];
  column?: IColumn;
  boardId?: string;
  activityCount?: number;
}

export interface IBoard {
  boardList: TaskBoard[];
  currentBoard: TaskBoard;
  currentTask: ITask;
  boardError: string;
  boardColumnError: string;
  boardTaskError: string;
}

const InitialState = {
  boardList: [] as any,
  currentBoard: {
    _id: '',
    name: '',
    description: '',
    columns: [],
    members: [],
  },
  currentTask: {},
  creatingBoard: false,
  creatingTask: false,
  fetchingBoards: false,
  fetchingBoard: false,
  fetchingColumn: false,
  fetchingTask: false,
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
  errorOnTaskDelete: '',
  errorOnUploadingTaskFile: '',
  errorOnTaskFileDelete: '',
};

export const BoardReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case BoardActionTypes.CREATE_BOARD_START:
      return {
        ...state,
        creatingBoard: true,
        boardError: '',
      };
    case BoardActionTypes.CREATE_BOARD_SUCCESS:
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
    case BoardActionTypes.CREATE_BOARD_FAILURE:
      return {
        ...state,
        creatingBoard: false,
        boardError: action.payload,
      };
    case BoardActionTypes.GET_ALL_BOARDS_START:
      return {
        ...state,
        boardError: '',
        fetchingBoards: true,
      };
    case BoardActionTypes.GET_ALL_BOARDS_SUCCESS:
      return {
        ...state,
        boardList: action.payload,
        boardError: '',
        fetchingBoards: false,
      };
    case BoardActionTypes.GET_ALL_BOARDS_FAILURE:
      return {
        ...state,
        boardError: action.payload,
        fetchingBoards: false,
      };
    case BoardActionTypes.SELECT_BOARD_START:
      return {
        ...state,
        errorOnFetchingBoard: '',
        fetchingBoard: true,
      };
    case BoardActionTypes.SELECT_BOARD_SUCCESS:
      return {
        ...state,
        currentBoard: action.payload,
        fetchingBoard: false,
      };
    case BoardActionTypes.SELECT_BOARD_FAILURE:
      return {
        ...state,
        errorOnFetchingBoard: action.payload,
        fetchingBoard: false,
      };
    case BoardActionTypes.UPDATE_BOARD_NAME_START:
      return {
        ...state,
        updatingBoardName: true,
        errorOnUpdatingBoardName: '',
      };
    case BoardActionTypes.UPDATE_BOARD_NAME_SUCCESS:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          name: action.payload.name,
        },
        updatingBoardName: false,
      };
    case BoardActionTypes.UPDATE_BOARD_NAME_FAILURE:
      return {
        ...state,
        errorOnUpdatingBoardName: action.payload,
        updatingBoardName: false,
      };
    case BoardActionTypes.ADD_TEAM_MEMBER_IN_BOARD_START:
      return {
        ...state,
        updatingBoard: true,
        boardError: '',
      };
    case BoardActionTypes.ADD_TEAM_MEMBER_IN_BOARD_SUCCESS:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          members: action.payload,
        },
        updatingBoard: false,
      };
    case BoardActionTypes.ADD_TEAM_MEMBER_IN_BOARD_FAILURE:
      return {
        ...state,
        updatingBoard: false,
        boardError: action.payload,
      };
    case BoardActionTypes.CREATE_COLUMN_START:
      return {
        ...state,
        fetchingColumn: true,
      };
    case BoardActionTypes.CREATE_COLUMN_SUCCESS:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columns: [...state.currentBoard.columns, action.payload],
        },
        fetchingColumn: false,
      };
    case BoardActionTypes.CREATE_COLUMN_FAILURE:
      return {
        ...state,
        boardColumnError: action.payload,
        fetchingColumn: false,
      };
    case BoardActionTypes.UPDATE_COLUMN_START:
      return {
        ...state,
        updatingColumn: true,
      };
    case BoardActionTypes.UPDATE_COLUMN_SUCCESS:
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
    case BoardActionTypes.UPDATE_COLUMN_FAILURE:
      return {
        ...state,
        boardColumnError: action.payload,
        updatingColumn: false,
      };
    case BoardActionTypes.CREATE_TASK_START:
      return {
        ...state,
        creatingTask: true,
        errorOnCreatingTask: '',
      };
    case BoardActionTypes.CREATE_TASK_SUCCESS:
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
    case BoardActionTypes.CREATE_TASK_FAILURE:
      return {
        ...state,
        errorOnCreatingTask: action.payload,
        creatingTask: false,
      };
    case BoardActionTypes.DRAG_AND_DROP_TASK_START:
      return {
        ...state,
        dragAndDrop: true,
      };
    case BoardActionTypes.DRAG_AND_DROP_TASK_SUCCESS:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columns: action.payload,
        },
        dragAndDrop: false,
      };
    case BoardActionTypes.DRAG_AND_DROP_TASK_FAILURE:
      return {
        ...state,
        dragAndDrop: false,
      };
    case BoardActionTypes.SELECT_TASK_START:
      return {
        ...state,
        taskError: '',
        fetchingTask: true,
      };
    case BoardActionTypes.SELECT_TASK_SUCCESS:
      return {
        ...state,
        currentTask: action.payload,
        fetchingTask: false,
      };
    case BoardActionTypes.SELECT_TASK_FAILURE:
      return {
        ...state,
        taskError: action.payload,
        fetchingTask: false,
      };
    case BoardActionTypes.UPDATE_TASK_START:
      return {
        ...state,
        updatingTask: true,
      };
    case BoardActionTypes.UPDATE_TASK_SUCCESS:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columns: (state.currentBoard.columns as any).map(
            (column: IColumn) =>
              column._id === action.payload.columnId._id
                ? {
                    ...column,
                    tasks:
                      column.tasks && column.tasks.length > 0
                        ? column.tasks.map((task: ITask) =>
                            task._id === action.payload._id
                              ? {
                                  ...task,
                                  name: action.payload.name,
                                  dueDate: action.payload.dueDate,
                                }
                              : task,
                          )
                        : [],
                  }
                : column,
          ),
        },
        currentTask: action.payload,
        updatingTask: false,
      };
    case BoardActionTypes.UPDATE_TASK_FAILURE:
      return {
        ...state,
        taskError: action.payload,
        updatingTask: false,
      };
    case BoardActionTypes.TASK_FILE_UP_START:
      return {
        ...state,
        uploadingTaskFile: true,
        errorOnUploadingTaskFile: '',
      };
    case BoardActionTypes.TASK_FILE_UP_SUCCESS:
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
    case BoardActionTypes.TASK_FILE_UP_FAILURE:
      return {
        ...state,
        uploadingTaskFile: false,
        errorOnUploadingTaskFile: action.payload,
      };
    case BoardActionTypes.TASK_FILE_DELETE_START:
      return {
        ...state,
        deletingTaskFile: true,
        errorOnTaskFileDelete: '',
      };
    case BoardActionTypes.TASK_FILE_DELETE_SUCCESS:
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
    case BoardActionTypes.TASK_FILE_DELETE_FAILURE:
      return {
        ...state,
        errorOnTaskFileDelete: action.payload,
        deletingTaskFile: false,
      };
    case BoardActionTypes.DELETE_TASK_START:
      return {
        ...state,
        deletingTask: true,
        errorOnTaskDelete: '',
      };
    case BoardActionTypes.DELETE_TASK_SUCCESS:
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
    case BoardActionTypes.DELETE_TASK_FAILURE: {
      return {
        ...state,
        deletingTask: false,
        errorOnTaskDelete: action.payload,
      };
    }
    case BoardActionTypes.CLEAR_CURRENT_BOARD: {
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
    case BoardActionTypes.UPDATE_BOARD_LOADING:
      return {
        ...state,
        fetchingBoard: action.payload,
      };
    case BoardActionTypes.UPDATE_TASK_LOADING:
      return {
        ...state,
        fetchingTask: action.payload,
      };
    default:
      return state;
  }
};
