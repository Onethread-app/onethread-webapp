import { tokenConfig } from 'stores/UtilsActions';
import {
  CREATE_BOARD,
  CREATE_BOARD_ERROR,
  GET_ALL_BOARDS,
  SELECT_BOARD,
  CREATE_COLUMN,
  CREATE_COLUMN_ERROR,
  CREATE_TASK_ERROR,
  CREATE_TASK,
  DRAG_AND_DROP_TASK,
  UPDATE_COLUMN,
  ADD_TEAM_MEMBER_IN_BOARD,
  SELECT_TASK,
  UPDATE_TASK,
} from './Types';
import { isEqual } from 'lodash';
import { TaskBoard, ITask } from './Reducer';
import { errorMessgeHandler } from 'components/final-form/utils';
import { tigrowApi } from 'config';
import { Toaster } from '@blueprintjs/core';

export const createBoard = (board: TaskBoard) => async (
  dispatch: any,
  getState: any,
) => {
  try {
    const headers = tokenConfig();
    // const companyId = getState().companyReducer.currentCompany._id;
    const projectId = getState().projectReducer.projectDetails._id;
    if ((headers as any).headers.Authorization) {
      const reqBody = {
        ...board,
        projectId,
      };
      const response = await tigrowApi.post(
        `boards`,
        reqBody,
        headers,
      );
      dispatch({ type: CREATE_BOARD, payload: response.data });
      return response.data;
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
  }
};

export const getAllBoards = () => async (
  dispatch: any,
  getState: any,
) => {
  try {
    const headers = tokenConfig();
    const projectId = getState().projectReducer.projectDetails._id;
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.get(
        `boards/boardProject?pid=${projectId}`,
        headers,
      );
      dispatch({ type: GET_ALL_BOARDS, payload: response.data });
      // return response.data;
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
  }
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

export const createColumn = (columnName: any) => async (
  dispatch: any,
  getState: any,
) => {
  try {
    const headers = tokenConfig();
    const companyId = getState().companyReducer.currentCompany._id;
    if ((headers as any).headers.Authorization) {
      if (companyId) {
        const response = await tigrowApi.post(
          `boardColumns`,
          columnName,
          headers,
        );
        dispatch({ type: CREATE_COLUMN, payload: response.data });
        return response.data;
      }
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({
        type: CREATE_COLUMN_ERROR,
        payload: 'Network error',
      });
    } else if (error.response.status === 401) {
      dispatch({
        type: CREATE_COLUMN_ERROR,
        payload:
          'Unauthorized user. Please enter valid email and password.',
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
  }
};

export const updateColumn = (columnInfo: any) => async (
  dispatch: any,
  getState: any,
) => {
  try {
    const headers = tokenConfig();
    const companyId = getState().companyReducer.currentCompany._id;
    if ((headers as any).headers.Authorization) {
      if (companyId) {
        const response = await tigrowApi.put(
          `boardColumns/${columnInfo._id}`,
          columnInfo,
          headers,
        );
        dispatch({ type: UPDATE_COLUMN, payload: response.data });
        return response.data;
      }
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({
        type: CREATE_COLUMN_ERROR,
        payload: 'Network error',
      });
    } else if (error.response.status === 401) {
      dispatch({
        type: CREATE_COLUMN_ERROR,
        payload:
          'Unauthorized user. Please enter valid email and password.',
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
  }
};

export const createTask = (task: any) => async (
  dispatch: any,
  getState: any,
) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.post(`tasks`, task, headers);
      const responseValue = {
        ...response.data,
        columnId: task.columnId,
      };
      dispatch({ type: CREATE_TASK, payload: responseValue });
      return response.data;
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({ type: CREATE_TASK_ERROR, payload: 'Network error' });
    } else if (error.response.status === 401) {
      dispatch({
        type: CREATE_TASK_ERROR,
        payload:
          'Unauthorized user. Please enter valid email and password.',
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
  }
};

export const dragAndDropTask = (
  taskId: string,
  sourceColumnId: string,
  destinationColumnId: string,
  taskIndexOfDestinationColumn: number,
) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    const currentBoard: TaskBoard = getState().boardIndexReducer
      .boardReducer.currentBoard;
    if ((headers as any).headers.Authorization) {
      const requestData = {
        taskId,
        sourceColumnId,
        destinationColumnId,
        taskIndexOfDestinationColumn,
      };
      const allColumns = currentBoard.columns!;
      let addedTask: ITask = {} as any;
      let destCol = 0;

      // find the dragged task, removed from source and save destination column index
      allColumns.forEach((column, i) => {
        if (isEqual(sourceColumnId, column._id)) {
          const index = column.tasks!.findIndex(
            (task) => task._id === taskId,
          );
          addedTask = column.tasks!.slice(index, index + 1)[0];
          column.tasks!.splice(index, 1);
        }
        if (isEqual(destinationColumnId, column._id)) {
          destCol = i;
        }
      });
      allColumns[destCol].tasks!.splice(
        taskIndexOfDestinationColumn,
        0,
        addedTask,
      );
      dispatch({ type: DRAG_AND_DROP_TASK, payload: allColumns });
      await tigrowApi.post(
        `tasks/dragTask`,
        requestData,
        headers,
      );
    }
  } catch (error) {
    Toaster.create().show({
      message: 'Operation Unsuccessful',
      action: {
        icon: 'refresh',
        className: 'bp3-intent-warning b',
        onClick: () => {
          window.location.reload(false);
        },
        text: 'Reload',
      },
      timeout: 300000,
    });
  }
};

export const addTeamMembersIntoBoard = (
  members: Array<string | undefined>,
  boardId: string | undefined,
) => async (dispatch: any) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.put(
        `boards/${boardId}/members`,
        { memberId: members },
        headers,
      );
      dispatch({
        type: ADD_TEAM_MEMBER_IN_BOARD,
        payload: response.data,
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log('error on member add in board');
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // dispatch({ type: ADD_TEAM_MEMBERS_ERROR, payload: "Network error" });
      // tslint:disable-next-line: no-console
      console.log('Network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
  }
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

export const updateTask = (task: ITask) => async (
  dispatch: any,
  getState: any,
) => {
  try {
    const headers = tokenConfig();
    let res;
    const taskId = getState().boardIndexReducer.boardReducer
      .currentTask._id;
    if ((headers as any).headers.Authorization) {
      res = await tigrowApi.put(`tasks/${taskId}`, task, headers);
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
        columnId: res.data.columnId,
      };
      dispatch({ type: UPDATE_TASK, payload: response });
    }
    return errorMessgeHandler(res);
  } catch (error) {
    return errorMessgeHandler(error);
    // if (isEqual(error.message, 'Network Error')) {
    //   dispatch({ type: CREATE_BOARD_ERROR, payload: 'Network error' });
    // } else if (error.response.status === 401) {
    //   dispatch({ type: CREATE_BOARD_ERROR,
    //      payload: 'Unauthorized user. Please enter valid email and password.' });
    // } else {
    //   // tslint:disable-next-line: no-console
    //   console.log(error.response);
    // }
  }
};
