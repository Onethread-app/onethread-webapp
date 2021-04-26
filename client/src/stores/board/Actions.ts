import { BoardActionTypes } from './Types';
import { TaskBoard, ITask } from './Reducer';

export interface ITaskDelete {
  taskId: string;
  columnId: string;
}

export interface ITaskFileUpload {
  file: any;
  columnId: string;
  taskId: string;
}

export interface ITaskFileDelete {
  fileId: string;
  columnId: string;
  taskId: string;
}

export const createBoard = (board: TaskBoard) => ({
  type: BoardActionTypes.CREATE_BOARD_START,
  payload: board,
});

export const createBoardSuccess = (response: any) => ({
  type: BoardActionTypes.CREATE_BOARD_FAILURE,
  payload: response,
});

export const createBoardFailure = (errorMessage: any) => ({
  type: BoardActionTypes.CREATE_BOARD_FAILURE,
  payload: errorMessage,
});

export const getAllBoards = () => ({
  type: BoardActionTypes.GET_ALL_BOARDS_START,
});

export const getAllBoardsSuccess = (response: any) => ({
  type: BoardActionTypes.GET_ALL_BOARDS_SUCCESS,
  payload: response,
});

export const getAllBoardsFailure = (errorMessage: any) => ({
  type: BoardActionTypes.GET_ALL_BOARDS_FAILURE,
  payload: errorMessage,
});

export const getSelectedBoard = (boardId: string | undefined) => ({
  type: BoardActionTypes.SELECT_BOARD_START,
  payload: boardId,
});

export const getSelectedBoardSuccess = (response: any) => ({
  type: BoardActionTypes.SELECT_BOARD_SUCCESS,
  payload: response,
});

export const getSelectedBoardFailure = (errorMessage: any) => ({
  type: BoardActionTypes.SELECT_BOARD_FAILURE,
  payload: errorMessage,
});

export const createColumn = (columnName: any) => ({
  type: BoardActionTypes.CREATE_COLUMN_START,
  payload: columnName,
});

export const createColumnSuccess = (response: any) => ({
  type: BoardActionTypes.CREATE_COLUMN_SUCCESS,
  payload: response,
});

export const createColumnFailure = (errorMessage: any) => ({
  type: BoardActionTypes.CREATE_COLUMN_FAILURE,
  payload: errorMessage,
});

export const updateColumn = (columnInfo: any) => ({
  type: BoardActionTypes.UPDATE_COLUMN_START,
  payload: columnInfo,
});

export const updateColumnSuccess = (response: any) => ({
  type: BoardActionTypes.UPDATE_COLUMN_SUCCESS,
  payload: response,
});

export const updateColumnFailure = (errorMessage: any) => ({
  type: BoardActionTypes.UPDATE_COLUMN_FAILURE,
  payload: errorMessage,
});

export const createTask = (task: any) => ({
  type: BoardActionTypes.CREATE_TASK_START,
  payload: task,
});

export const createTaskSuccess = (response: any) => ({
  type: BoardActionTypes.CREATE_TASK_SUCCESS,
  payload: response,
});

export const createTaskFailure = (errorMessage: any) => ({
  type: BoardActionTypes.CREATE_TASK_FAILURE,
  payload: errorMessage,
});

export const dragAndDropTask = (
  taskId: string,
  sourceColumnId: string,
  destinationColumnId: string,
  taskIndexOfDestinationColumn: number,
) => ({
  type: BoardActionTypes.DRAG_AND_DROP_TASK_START,
  taskId,
  sourceColumnId,
  destinationColumnId,
  taskIndexOfDestinationColumn,
});

export const dragAndDropTaskSuccess = (response: any) => ({
  type: BoardActionTypes.DRAG_AND_DROP_TASK_SUCCESS,
  payload: response,
});

export const dragAndDropTaskFailure = (errorMessage: any) => ({
  type: BoardActionTypes.DRAG_AND_DROP_TASK_FAILURE,
  payload: errorMessage,
});

export const addTeamMembersIntoBoard = (
  members: Array<string | undefined>,
  boardId: string | undefined,
) => ({
  type: BoardActionTypes.ADD_TEAM_MEMBER_IN_BOARD_START,
  members,
  boardId,
});

export const addTeamMembersIntoBoardSuccess = (response: any) => ({
  type: BoardActionTypes.ADD_TEAM_MEMBER_IN_BOARD_SUCCESS,
  payload: response,
});

export const addTeamMembersIntoBoardFailure = (
  errorMessage: any,
) => ({
  type: BoardActionTypes.ADD_TEAM_MEMBER_IN_BOARD_FAILURE,
  payload: errorMessage,
});

export const getSelectedTaskDetails = (taskId: string) => ({
  type: BoardActionTypes.SELECT_TASK_START,
  payload: taskId,
});

export const getSelectedTaskDetailsSuccess = (response: any) => ({
  type: BoardActionTypes.SELECT_TASK_SUCCESS,
  payload: response,
});

export const getSelectedTaskDetailsFailure = (errorMessage: any) => ({
  type: BoardActionTypes.SELECT_TASK_FAILURE,
  payload: errorMessage,
});

export const updateTask = (task: ITask) => ({
  type: BoardActionTypes.UPDATE_TASK_START,
  payload: task,
});

export const updateTaskSuccess = (response: any) => ({
  type: BoardActionTypes.UPDATE_TASK_SUCCESS,
  payload: response,
});

export const updateTaskFailure = (errorMessage: any) => ({
  type: BoardActionTypes.UPDATE_TASK_FAILURE,
  payload: errorMessage,
});

export const taskFileUpload = (payload: ITaskFileUpload) => ({
  type: BoardActionTypes.TASK_FILE_UP_START,
  payload,
});

export const taskFileUploadSuccess = (response: any) => ({
  type: BoardActionTypes.TASK_FILE_UP_SUCCESS,
  payload: response,
});

export const taskFileUploadFailure = (errorMessage: any) => ({
  type: BoardActionTypes.TASK_FILE_UP_FAILURE,
  payload: errorMessage,
});

export const taskFileDelete = (payload: ITaskFileDelete) => ({
  type: BoardActionTypes.TASK_FILE_DELETE_START,
  payload,
});

export const taskFileDeleteSuccess = (response: any) => ({
  type: BoardActionTypes.TASK_FILE_DELETE_SUCCESS,
  payload: response,
});

export const taskFileDeleteFailure = (errorMessage: any) => ({
  type: BoardActionTypes.TASK_FILE_DELETE_FAILURE,
  payload: errorMessage,
});

export const deleteTask = (payload: ITaskDelete) => ({
  type: BoardActionTypes.DELETE_TASK_START,
  payload,
});

export const deleteTaskSuccess = (payload: ITaskDelete) => ({
  type: BoardActionTypes.DELETE_TASK_SUCCESS,
  payload,
});

export const deleteTaskFailure = (errorMessage: any) => ({
  type: BoardActionTypes.DELETE_TASK_FAILURE,
  payload: errorMessage,
});

export const clearCurrentBoard = () => ({
  type: BoardActionTypes.CLEAR_CURRENT_BOARD,
});
