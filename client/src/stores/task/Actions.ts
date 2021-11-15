import { TaskActionType } from './Types';
import {
  TaskBoard,
  ITask,
  SortTasksBy,
  IFilterUser,
  // ITaskStatus,
} from './Reducer';

export interface ITaskDelete {
  taskId: string;
  // columnId: string;
}

export interface ITaskFileUpload {
  file: any;
  taskId: string;
}

export interface ITaskFileDelete {
  fileId: string;
  columnId: string;
  taskId: string;
}

export const createBoard = (board: TaskBoard) => ({
  type: TaskActionType.CREATE_BOARD_START,
  payload: board,
});

export const createBoardSuccess = (response: any) => ({
  type: TaskActionType.CREATE_BOARD_FAILURE,
  payload: response,
});

export const createBoardFailure = (errorMessage: any) => ({
  type: TaskActionType.CREATE_BOARD_FAILURE,
  payload: errorMessage,
});

export const getAllBoards = () => ({
  type: TaskActionType.GET_ALL_BOARDS_START,
});

export const getAllBoardsSuccess = (response: any) => ({
  type: TaskActionType.GET_ALL_BOARDS_SUCCESS,
  payload: response,
});

export const getAllBoardsFailure = (errorMessage: any) => ({
  type: TaskActionType.GET_ALL_BOARDS_FAILURE,
  payload: errorMessage,
});

export const getAllUserTasks = () => ({
  type: TaskActionType.GET_ALL_USER_TASKS_START,
});

export const getAllUserTasksSuccess = (response: any) => ({
  type: TaskActionType.GET_ALL_USER_TASKS_SUCCESS,
  payload: response,
});

export const getAllUserTasksFailure = (errorMessage: any) => ({
  type: TaskActionType.GET_ALL_USER_TASKS_FAILURE,
  payload: errorMessage,
});

export const getAllCompanyTasks = () => ({
  type: TaskActionType.GET_ALL_TASKS_FOR_COMPANY_START,
});

export const getAllCompanyTasksSuccess = (response: any) => ({
  type: TaskActionType.GET_ALL_TASKS_FOR_COMPANY_SUCCESS,
  payload: response,
});

export const getAllCompanyTasksFailure = (errorMessage: any) => ({
  type: TaskActionType.GET_ALL_TASKS_FOR_COMPANY_FAILURE,
  payload: errorMessage,
});

export const getAllProjectTasks = () => ({
  type: TaskActionType.GET_ALL_TASKS_FOR_PROJECT_START,
});

export const getAllProjectTasksSuccess = (response: any) => ({
  type: TaskActionType.GET_ALL_TASKS_FOR_PROJECT_SUCCESS,
  payload: response,
});

export const getAllProjectTasksFailure = (errorMessage: any) => ({
  type: TaskActionType.GET_ALL_TASKS_FOR_PROJECT_FAILURE,
  payload: errorMessage,
});
export const getSelectedBoard = (boardId: string | undefined) => ({
  type: TaskActionType.SELECT_BOARD_START,
  payload: boardId,
});

export const getSelectedBoardSuccess = (response: any) => ({
  type: TaskActionType.SELECT_BOARD_SUCCESS,
  payload: response,
});

export const getSelectedBoardFailure = (errorMessage: any) => ({
  type: TaskActionType.SELECT_BOARD_FAILURE,
  payload: errorMessage,
});

export const updateBoardName = (name: string) => ({
  type: TaskActionType.UPDATE_BOARD_NAME_START,
  payload: name,
});

export const updateBoardNameSuccess = (response: any) => ({
  type: TaskActionType.UPDATE_BOARD_NAME_SUCCESS,
  payload: response,
});

export const updateBoardNameFailure = (errorMessage: any) => ({
  type: TaskActionType.UPDATE_BOARD_NAME_FAILURE,
  payload: errorMessage,
});

export const createColumn = (columnName: any) => ({
  type: TaskActionType.CREATE_COLUMN_START,
  payload: columnName,
});

export const createColumnSuccess = (response: any) => ({
  type: TaskActionType.CREATE_COLUMN_SUCCESS,
  payload: response,
});

export const createColumnFailure = (errorMessage: any) => ({
  type: TaskActionType.CREATE_COLUMN_FAILURE,
  payload: errorMessage,
});

export const updateColumn = (columnInfo: any) => ({
  type: TaskActionType.UPDATE_COLUMN_START,
  payload: columnInfo,
});

export const updateColumnSuccess = (response: any) => ({
  type: TaskActionType.UPDATE_COLUMN_SUCCESS,
  payload: response,
});

export const updateColumnFailure = (errorMessage: any) => ({
  type: TaskActionType.UPDATE_COLUMN_FAILURE,
  payload: errorMessage,
});

export const createTask = (task: any) => ({
  type: TaskActionType.CREATE_TASK_START,
  payload: task,
});

export const createTaskSuccess = (response: any) => ({
  type: TaskActionType.CREATE_TASK_SUCCESS,
  payload: response,
});

export const createTaskFailure = (errorMessage: any) => ({
  type: TaskActionType.CREATE_TASK_FAILURE,
  payload: errorMessage,
});

export const dragAndDropTask = (
  taskId: string,
  sourceColumnId: string,
  destinationColumnId: string,
  taskIndexOfDestinationColumn: number,
) => ({
  type: TaskActionType.DRAG_AND_DROP_TASK_START,
  taskId,
  sourceColumnId,
  destinationColumnId,
  taskIndexOfDestinationColumn,
});

export const dragAndDropTaskSuccess = (response: any) => ({
  type: TaskActionType.DRAG_AND_DROP_TASK_SUCCESS,
  payload: response,
});

export const dragAndDropTaskFailure = (errorMessage: any) => ({
  type: TaskActionType.DRAG_AND_DROP_TASK_FAILURE,
  payload: errorMessage,
});

export const addTeamMembersIntoBoard = (
  members: Array<string | undefined>,
  boardId: string | undefined,
) => ({
  type: TaskActionType.ADD_TEAM_MEMBER_IN_BOARD_START,
  members,
  boardId,
});

export const addTeamMembersIntoBoardSuccess = (response: any) => ({
  type: TaskActionType.ADD_TEAM_MEMBER_IN_BOARD_SUCCESS,
  payload: response,
});

export const addTeamMembersIntoBoardFailure = (
  errorMessage: any,
) => ({
  type: TaskActionType.ADD_TEAM_MEMBER_IN_BOARD_FAILURE,
  payload: errorMessage,
});

export const getSelectedTaskDetails = (taskId: string) => ({
  type: TaskActionType.SELECT_TASK_START,
  payload: taskId,
});

export const getSelectedTaskDetailsSuccess = (response: any) => ({
  type: TaskActionType.SELECT_TASK_SUCCESS,
  payload: response,
});

export const getSelectedTaskDetailsFailure = (errorMessage: any) => ({
  type: TaskActionType.SELECT_TASK_FAILURE,
  payload: errorMessage,
});

export const updateTask = (task: ITask) => ({
  type: TaskActionType.UPDATE_TASK_START,
  payload: task,
});

export const updateTaskSuccess = (response: any) => ({
  type: TaskActionType.UPDATE_TASK_SUCCESS,
  payload: response,
});

export const updateTaskFailure = (errorMessage: any) => ({
  type: TaskActionType.UPDATE_TASK_FAILURE,
  payload: errorMessage,
});

export const taskFileUpload = (payload: ITaskFileUpload) => ({
  type: TaskActionType.TASK_FILE_UP_START,
  payload,
});

export const taskFileUploadSuccess = (response: any) => ({
  type: TaskActionType.TASK_FILE_UP_SUCCESS,
  payload: response,
});

export const taskFileUploadFailure = (errorMessage: any) => ({
  type: TaskActionType.TASK_FILE_UP_FAILURE,
  payload: errorMessage,
});

export const taskFileDelete = (payload: ITaskFileDelete) => ({
  type: TaskActionType.TASK_FILE_DELETE_START,
  payload,
});

export const taskFileDeleteSuccess = (response: any) => ({
  type: TaskActionType.TASK_FILE_DELETE_SUCCESS,
  payload: response,
});

export const taskFileDeleteFailure = (errorMessage: any) => ({
  type: TaskActionType.TASK_FILE_DELETE_FAILURE,
  payload: errorMessage,
});

export const deleteTask = (payload: ITaskDelete) => ({
  type: TaskActionType.DELETE_TASK_START,
  payload,
});

export const deleteTaskSuccess = (payload: ITaskDelete) => ({
  type: TaskActionType.DELETE_TASK_SUCCESS,
  payload,
});

export const deleteTaskFailure = (errorMessage: any) => ({
  type: TaskActionType.DELETE_TASK_FAILURE,
  payload: errorMessage,
});

export const clearCurrentBoard = () => ({
  type: TaskActionType.CLEAR_CURRENT_BOARD,
});

export const updateBoardLoading = (loading: boolean) => ({
  type: TaskActionType.UPDATE_BOARD_LOADING,
  payload: loading,
});

export const updateTaskLoading = (loading: boolean) => ({
  type: TaskActionType.UPDATE_TASK_LOADING,
  payload: loading,
});

export const setSortBy = (type: SortTasksBy) => ({
  type: TaskActionType.SET_SORT_BY,
  payload: type,
});

export const setFilerUsers = (list: IFilterUser[]) => ({
  type: TaskActionType.SET_FILTER_USERS,
  payload: list,
});

export const setPreferredView = (
  v: 'board' | 'list' | 'calendar',
) => ({
  type: TaskActionType.SET_PREFERRED_VIEW,
  payload: v,
});

export const updateCurrentTaskColumnId = (data) => ({
  type: TaskActionType.UPDATE_CURRENTTASK_COLUMNID,
  payload: data,
});

export const updateTaskTimeSpent = (payload: number) => ({
  type: TaskActionType.UPDATE_TASK_TIME_SPENT,
  payload,
});

export const clearCompanyTasks = () => ({
  type: TaskActionType.CLEAR_COMPANY_TASKS,
});

export const createTaskStatus = (payload: {
  name: string;
  type: string;
  positionInBoard: number;
  projectId: string;
}) => ({
  type: TaskActionType.CREATE_TASK_STATUS,
  payload,
});

export const createTaskStatusSuccess = (response: any) => ({
  type: TaskActionType.CREATE_TASK_STATUS_SUCCESS,
  payload: response,
});

export const createTaskStatusFailure = (errorMessage: string) => ({
  type: TaskActionType.CREATE_TASK_STATUS_FAILURE,
  payload: errorMessage,
});

export const updateTaskStatus = (payload: {
  name: string;
  positionInBoard: number;
  taskStatusId: string;
  projectId: string;
}) => ({
  type: TaskActionType.UPDATE_TASK_STATUS,
  payload,
});

export const updateTaskStatusSuccess = (response: any) => ({
  type: TaskActionType.UPDATE_TASK_STATUS_SUCCESS,
  payload: response,
});

export const updateTaskStatusFailure = (errorMessage: string) => ({
  type: TaskActionType.UPDATE_TASK_STATUS_FAILURE,
  payload: errorMessage,
});

export const getAllTaskStatusInProject = (projectId: string) => ({
  type: TaskActionType.GET_ALL_TASK_STATUS,
  payload: projectId,
});

export const getAllTaskStatusInProjectSuccess = (response: any) => ({
  type: TaskActionType.GET_ALL_TASK_STATUS_SUCCESS,
  payload: response,
});

export const getAllTaskStatusInProjectFailure = (
  errorMessage: string,
) => ({
  type: TaskActionType.GET_ALL_TASK_STATUS_FAILURE,
  payload: errorMessage,
});

export const createSubTask = (payload: {
  name: string;
  taskId: string;
  projectId: string;
  companyId: string;
}) => ({
  type: TaskActionType.CREATE_SUBTASK,
  payload,
});

export const createSubTaskSuccess = (payload) => ({
  type: TaskActionType.CREATE_SUBTASK_SUCCESS,
  payload,
});

export const createSubTaskFailure = (errorMessage: string) => ({
  type: TaskActionType.CREATE_SUBTASK_FAILURE,
  payload: errorMessage,
});

export const taskMarkAsCompleted = (payload: {
  projectId: string;
  taskId: string;
  companyId: string;
}) => ({
  type: TaskActionType.TASK_MARK_AS_COMPLETED,
  payload,
});

export const taskMarkAsCompletedSuccess = (response: any) => ({
  type: TaskActionType.TASK_MARK_AS_COMPLETED_SUCCESS,
  payload: response,
});

export const taskMarkAsCompletedFailure = (errorMessage: string) => ({
  type: TaskActionType.TASK_MARK_AS_COMPLETED_FAILURE,
  payload: errorMessage,
});

export const getTaskMembers = (payload: {}) => ({
  type: TaskActionType.GET_TASK_MEMBERS,
  payload,
});

export const getTaskMembersSuccess = (response: any) => ({
  type: TaskActionType.GET_TASK_MEMBERS_SUCCESS,
  payload: response,
});

export const getTaskMembersFailure = (errorMessage: string) => ({
  type: TaskActionType.GET_TASK_MEMBERS_FAILURE,
  payload: errorMessage,
});
