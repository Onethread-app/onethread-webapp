import { tokenConfig } from 'stores/UtilsActions';
import tigrowApi from 'tigrowApi';
import { CREATE_BOARD, CREATE_BOARD_ERROR, GET_ALL_BOARDS, BOARD_LOADING, SELECT_BOARD, COLUMN_LOADING, CREATE_COLUMN, CREATE_COLUMN_ERROR, CREATE_TASK_LOADING, CREATE_TASK_ERROR, CREATE_TASK, DRAG_AND_DROP_TASK_LOADING, DRAG_AND_DROP_TASK, DRAG_AND_DROP_TASK_ERROR } from './Types';
import { isEqual } from 'lodash';
import { TaskBoard } from './Reducer';

export const createBoard = (board: TaskBoard) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig(getState);
    const companyId = getState().companyReducer.currentCompany._id;
    if ((headers as any).headers.Authorization) {
      dispatch({ type: BOARD_LOADING });
      const reqBody = {
        ...board,
        companyId
      };
      const response = await tigrowApi.post(`/boards`, reqBody, headers);
      dispatch({ type: CREATE_BOARD, payload: response.data });
      // console.log(`response.data: `, response.data);
      return response.data;
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({ type: CREATE_BOARD_ERROR, payload: 'Network error' });
    } else if (error.response.status === 401) {
      dispatch({ type: CREATE_BOARD_ERROR, payload: 'Unauthorized user. Please enter valid email and password.' });
    } else {
      console.log(error.response);
    }
  }
}

export const getAllBoards = () => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig(getState);
    const companyId = getState().companyReducer.currentCompany._id;
    if ((headers as any).headers.Authorization) {
      dispatch({ type: BOARD_LOADING });
      const response = await tigrowApi.get(`/boards?companyId=${companyId}`, headers);
      dispatch({ type: GET_ALL_BOARDS, payload: response.data });
      // return response.data;
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({ type: CREATE_BOARD_ERROR, payload: 'Network error' });
    } else if (error.response.status === 401) {
      dispatch({ type: CREATE_BOARD_ERROR, payload: 'Unauthorized user. Please enter valid email and password.' });
    } else {
      console.log(error.response);
    }
  }
}

export const getSelectedBoard = (boardId: string | undefined) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig(getState);
    if ((headers as any).headers.Authorization && boardId) {
      dispatch({ type: BOARD_LOADING });
      const response = await tigrowApi.get(`/boards/${boardId}`, headers);
      dispatch({ type: SELECT_BOARD, payload: response.data });
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({ type: CREATE_BOARD_ERROR, payload: 'Network error' });
    } else if (error.response.status === 401) {
      dispatch({ type: CREATE_BOARD_ERROR, payload: 'Unauthorized user. Please enter valid email and password.' });
    } else {
      console.log(error.response);
    }
  }
}

export const createColumn = (columnName: any) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig(getState);
    const companyName = getState().companyReducer.currentCompany.name;
    if ((headers as any).headers.Authorization) {
      dispatch({ type: COLUMN_LOADING });
      if (companyName) {
        const response = await tigrowApi.post(`/boardColumns`, columnName, headers);
        dispatch({ type: CREATE_COLUMN, payload: response.data });
        return response.data;
      }
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({ type: CREATE_COLUMN_ERROR, payload: 'Network error' });
    } else if (error.response.status === 401) {
      dispatch({ type: CREATE_COLUMN_ERROR, payload: 'Unauthorized user. Please enter valid email and password.' });
    } else {
      console.log(error.response);
    }
  }
}

export const createTask = (task: any) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig(getState);
    if ((headers as any).headers.Authorization) {
      dispatch({ type: CREATE_TASK_LOADING });
      const response = await tigrowApi.post(`/tasks`, task, headers);
      const responseValue = {
        ...response.data,
        columnId: task.columnId
      }
      dispatch({ type: CREATE_TASK, payload: responseValue });
      return response.data;
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({ type: CREATE_TASK_ERROR, payload: 'Network error' });
    } else if (error.response.status === 401) {
      dispatch({ type: CREATE_TASK_ERROR, payload: 'Unauthorized user. Please enter valid email and password.' });
    } else {
      console.log(error.response);
    }
  }
}

export const dragAndDropTask = (taskId: string, sourceColumnId: string, destinationColumnId: string, taskIndexOfDestinationColumn: number) =>
  async (dispatch: any, getState: any) => {
    try {
      const headers = tokenConfig(getState);
      const currentBoard: TaskBoard = getState().taskManagementReducer.boardReducer.currentBoard;
      if ((headers as any).headers.Authorization) {
        dispatch({ type: DRAG_AND_DROP_TASK_LOADING });
        const requestData = {
          taskId,
          sourceColumnId,
          destinationColumnId,
          taskIndexOfDestinationColumn
        }
        // console.log(`requestData: `, requestData);
        const response = await tigrowApi.post(`/tasks/dragTask`, requestData, headers);
        const updatedColumns = response.data;
        currentBoard.columns!.map(column => {
          if (isEqual(updatedColumns.sourceColumn._id, column._id)) {
            column.tasks = updatedColumns.sourceColumn.tasks;
          }
          if (isEqual(updatedColumns.destinationColumn._id, column._id)) {
            column.tasks = updatedColumns.destinationColumn.tasks;
          }
          return column;
        });
        dispatch({ type: DRAG_AND_DROP_TASK, payload: currentBoard.columns });
      }
    } catch (error) {
      if (isEqual(error.message, 'Network Error')) {
        dispatch({ type: DRAG_AND_DROP_TASK_ERROR, payload: 'Network error' });
      } else if (error.response.status && error.response.status === 401) {
        dispatch({ type: DRAG_AND_DROP_TASK_ERROR, payload: 'Unauthorized user. Please enter valid email and password.' });
      } else {
        console.log(error.response);
      }
    }
  }