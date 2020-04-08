import { tokenConfig } from 'stores/UtilsActions';
import {
  GET_ALL_SUBTASK,
  CREATE_SUBTASK,
  COMPLETE_SUBTASK,
  DELETE_SUBTASK,
  UPDATE_SUBTASK_TITLE,
} from './Types';
import { ISubTask } from './Reducer';
import { errorMessgeHandler } from 'components/final-form/utils';
import { tigrowApi } from 'config';

export const getAllSubTask = () => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    const taskId = getState().boardIndexReducer.boardReducer.currentTask._id;
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.get(
        `subTasks?taskId=${taskId}`,
        headers
      );
      dispatch({ type: GET_ALL_SUBTASK, payload: response.data });
    }
  } catch (error) {
    // tslint:disable-next-line: no-console
    console.log(error);
    // if (isEqual(error.message, 'Network Error')) {
    //   // dispatch({ type: CREATE_BOARD_ERROR, payload: 'Network error' });
    // } else if (error.response.status === 401) {
    //   dispatch({ type: CREATE_BOARD_ERROR,
    //      payload: 'Unauthorized user. Please enter valid email and password.' });
    // } else {
    //   // tslint:disable-next-line: no-console
    //   console.log(error.response);
    // }
  }
};

export const createSubTask = (subTask: ISubTask) => async (
  dispatch: any,
  getState: any
) => {
  try {
    const headers = tokenConfig();
    let response;
    const taskId = getState().boardIndexReducer.boardReducer.currentTask._id;
    if ((headers as any).headers.Authorization) {
      const reqBody = {
        ...subTask,
        taskId,
      };
      response = await tigrowApi.post(`subTasks`, reqBody, headers);
      dispatch({ type: CREATE_SUBTASK, payload: response.data });
    }
    return errorMessgeHandler(response);
  } catch (error) {
    return errorMessgeHandler(error);
  }
};

export const updateSubTask = (subTask: ISubTask) => async (
  dispatch: any,
  getState: any
) => {
  try {
    const headers = tokenConfig();
    let response;
    if ((headers as any).headers.Authorization) {
      const reqBody = {
        done: subTask.done,
      };
      response = await tigrowApi.put(
        `subTasks/${subTask._id}`,
        reqBody,
        headers
      );
      dispatch({ type: COMPLETE_SUBTASK, payload: response.data });
    }
    return errorMessgeHandler(response);
  } catch (error) {
    return errorMessgeHandler(error);
  }
};

export const updateSubTaskTitile = (subTask: ISubTask) => async (
  dispatch: any,
  getState: any
) => {
  try {
    const headers = tokenConfig();
    let response;
    if ((headers as any).headers.Authorization) {
      const reqBody = {
        name: subTask.name,
      };
      response = await tigrowApi.put(
        `subTasks/${subTask._id}`,
        reqBody,
        headers
      );
      dispatch({ type: UPDATE_SUBTASK_TITLE, payload: response.data });
    }
    return errorMessgeHandler(response);
  } catch (error) {
    return errorMessgeHandler(error);
  }
};

export const deleteSubTask = (subTask: ISubTask) => async (
  dispatch: any,
  getState: any
) => {
  try {
    const headers = tokenConfig();
    let response;
    if ((headers as any).headers.Authorization) {
      const subTaskId = subTask._id;
      response = await tigrowApi.delete(`subTasks/${subTaskId}`, headers);
      dispatch({ type: DELETE_SUBTASK, payload: subTaskId });
    }
    return errorMessgeHandler(response);
  } catch (error) {
    return errorMessgeHandler(error);
  }
};
