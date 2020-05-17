import { tokenConfig } from 'stores/UtilsActions';
import {
  CREATE_BOARD_ERROR,
  SELECT_BOARD,
  SELECT_TASK,
  board,
} from './Types';
import { isEqual } from 'lodash';
import { TaskBoard, ITask } from './Reducer';
import { tigrowApi } from 'config';

export const createBoard = (boardDetails: TaskBoard) => {
  return{
    type: board.CREATE_BOARD_LOAD,
    boardDetails
  };
};

export const getAllBoards = () => {
  return {
    type: board.GET_ALL_BOARDS_LOAD
  };
};

export const getSelectedBoard = (
  boardId: string | undefined,
) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization && boardId) {
      const response = await tigrowApi.get(
        `boards/${boardId}`,
        headers,
      );
      dispatch({ type: SELECT_BOARD, payload: response.data });
      return response.data;
    } else {
      return 500;
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({
        type: CREATE_BOARD_ERROR,
        payload: 'Network error',
      });
    } else if (error.response.status === 401) {
      dispatch({
        type: CREATE_BOARD_ERROR,
        payload:
          'Unauthorized user. Please enter valid email and password.',
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
    return error.response.status;
  }
};

export const createColumn = (columnName: any) => {
  return {
    type: board.CREATE_COLUMN_LOAD,
    columnName
  };
};

export const updateColumn = (columnInfo: any) => {
  return {
    type: board.UPDATE_COLUMN_LOAD,
    columnInfo
  };
};

export const createTask = (task: any) => {
  return {
    type: board.CREATE_TASK_LOAD,
    task
  };
};

export const dragAndDropTask = (
  taskId: string,
  sourceColumnId: string,
  destinationColumnId: string,
  taskIndexOfDestinationColumn: number,
) => {
  return {
    type: board.DRAG_AND_DROP_TASK_LOADING,
    taskId,
    sourceColumnId,
    destinationColumnId,
    taskIndexOfDestinationColumn
  };
};

export const addTeamMembersIntoBoard = (
  members: Array<string | undefined>,
  boardId: string | undefined,
) => {
  return {
    type: board.ADD_TEAM_MEMBER_IN_BOARD_LOAD,
    members,
    boardId
  };
};

export const getSelectedTaskDetails = (
  taskId: string | undefined,
) => async (dispatch: any) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization && taskId) {
      // dispatch({ type: BOARD_LOADING });
      const res = await tigrowApi.get(`tasks/${taskId}`, headers);
      const response = {
        _id: res.data._id,
        name: res.data.name,
        createdAt: res.data.createdAt,
        dueDate: res.data.dueDate,
        createdBy:
          res.data.account.firstName +
          ' ' +
          res.data.account.lastName,
        description: res.data.description,
        priority: res.data.priority,
        currentColumnName: res.data.columnId.name,
      };

      dispatch({ type: SELECT_TASK, payload: response });
      return response;
    } else {
      return 500;
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({
        type: CREATE_BOARD_ERROR,
        payload: 'Network error',
      });
    } else if (error.response.status === 401) {
      dispatch({
        type: CREATE_BOARD_ERROR,
        payload:
          'Unauthorized user. Please enter valid email and password.',
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
    return error.response.status;
  }
};

export const updateTask = (task: ITask) => {
  return {
    type: board.UPDATE_TASK_LOAD,
    task
  };
};
