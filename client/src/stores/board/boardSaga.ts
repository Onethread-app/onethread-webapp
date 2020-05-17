import { all, put, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import {
  CREATE_BOARD_ERROR, board, GET_ALL_BOARDS,
  CREATE_COLUMN, CREATE_COLUMN_ERROR,
  UPDATE_COLUMN, CREATE_TASK, CREATE_TASK_ERROR,
  DRAG_AND_DROP_TASK, UPDATE_TASK, ADD_TEAM_MEMBER_IN_BOARD, CREATE_BOARD,
  // SELECT_BOARD
} from './Types';
import { tigrowApi } from 'config';
import { tokenConfig } from 'stores/UtilsActions';
import { isEqual } from 'lodash';
import { ITask } from './Reducer';
import { Toaster } from '@blueprintjs/core';
import { errorMessgeHandler } from 'components/final-form/utils';

const takeEvery: any = Eff.takeEvery; // <-- new
const takeLatest: any = Eff.takeLatest;

function* createBoard(action) {
  try {
    const headers = tokenConfig();
    const selectProjectId = (state) => state.projectReducer.projectDetails._id;
    const projectId = yield select(selectProjectId);
    if ((headers as any).headers.Authorization) {
      const reqBody = {
        ...action.boardDetails,
        projectId
      };
      const response = yield tigrowApi.post(
        `boards`,
        reqBody,
        headers,
      );
      yield put({ type: CREATE_BOARD, payload: response.data });
      return response.data;
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      yield put({
        type: CREATE_BOARD_ERROR,
        payload: 'Network error',
      });
    } else if (error.response.status === 401) {
      yield put({
        type: CREATE_BOARD_ERROR,
        payload:
          'Unauthorized user. Please enter valid email and password.',
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
  }
}

// function* getSelectedBoard(action) {
//   try {
//     console.log(action);
    
//     const headers = tokenConfig();
//     if ((headers as any).headers.Authorization && action.boardId) {
//       const response = yield tigrowApi.get(
//         `boards/${action.boardId}`,
//         headers,
//       );
//       console.log(response);
//       yield put({ type: SELECT_BOARD, payload: response.data });
//       yield put({
//         type: board.RESPONSE_STATUS_CODE,
//         payload: response.status
//       });
//       yield put({
//         type: board.RESPONSE_BOARD_ID,
//         payload: response.data._id
//       });
//       return response.data;
//     } else {
//       return 500;
//     }
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       yield put({
//         type: CREATE_BOARD_ERROR,
//         payload: 'Network error',
//       });
//     } else if (error.response.status === 401) {
//       yield put({
//         type: CREATE_BOARD_ERROR,
//         payload:
//           'Unauthorized user. Please enter valid email and password.',
//       });
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log(error.response);
//     }
//     return error.response.status;
//   }
// }

function* getAllBoards() {
  try {
    const headers = tokenConfig();
    const selectProjectId = (state) => state.projectReducer.pid;
    const pid = yield select(selectProjectId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `boards/boardProject/${pid}`,
        headers,
      );
      yield put({ type: GET_ALL_BOARDS, payload: response.data });
      // return response.data;
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      yield put({
        type: CREATE_BOARD_ERROR,
        payload: 'Network error',
      });
    } else if (error.response.status === 401) {
      yield put({
        type: CREATE_BOARD_ERROR,
        payload:
          'Unauthorized user. Please enter valid email and password.',
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
  }
}

function* createColumn(action) {
  try {
    const headers = tokenConfig();
    const selectCompanyId = (state) =>
      state.companyReducer.currentCompany._id;
    const companyId = yield select(selectCompanyId);
    if ((headers as any).headers.Authorization) {
      if (companyId) {
        const response = yield tigrowApi.post(
          `boardColumns`,
          action.columnName,
          headers,
        );
        yield put({ type: CREATE_COLUMN, payload: response.data });
        return response.data;
      }
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      yield put({
        type: CREATE_COLUMN_ERROR,
        payload: 'Network error',
      });
    } else if (error.response.status === 401) {
      yield put({
        type: CREATE_COLUMN_ERROR,
        payload:
          'Unauthorized user. Please enter valid email and password.',
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
  }
}

function* updateColumn(action) {
  try {
    const headers = tokenConfig();
    const selectCompanyId = (state) =>
      state.companyReducer.currentCompany._id;
    const companyId = yield select(selectCompanyId);
    if ((headers as any).headers.Authorization) {
      if (companyId) {
        const response = yield tigrowApi.put(
          `boardColumns/${action.columnInfo._id}`,
          action.columnInfo,
          headers,
        );
        yield put({ type: UPDATE_COLUMN, payload: response.data });
        return response.data;
      }
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      yield put({
        type: CREATE_COLUMN_ERROR,
        payload: 'Network error',
      });
    } else if (error.response.status === 401) {
      yield put({
        type: CREATE_COLUMN_ERROR,
        payload:
          'Unauthorized user. Please enter valid email and password.',
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
  }
}

function* createTask(action) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.post(`tasks`, action.task, headers);
      const responseValue = {
        ...response.data,
        columnId: action.task.columnId,
      };
      yield put({ type: CREATE_TASK, payload: responseValue });
      return response.data;
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      yield put({ type: CREATE_TASK_ERROR, payload: 'Network error' });
    } else if (error.response.status === 401) {
      yield put({
        type: CREATE_TASK_ERROR,
        payload:
          'Unauthorized user. Please enter valid email and password.',
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
  }
}

function* dragAndDropTask(action) {
  try {
    const headers = tokenConfig();
    const selectBoard = (state) =>
      state.boardIndexReducer.boardReducer.currentBoard;
    const currentBoard = yield select(selectBoard);
    if ((headers as any).headers.Authorization) {
      const requestData = {
        taskId: action.taskId,
        sourceColumnId: action.sourceColumnId,
        destinationColumnId: action.destinationColumnId,
        taskIndexOfDestinationColumn: action.taskIndexOfDestinationColumn,
      };
      const allColumns = currentBoard.columns!;
      let addedTask: ITask = {} as any;
      let destCol = 0;

      // find the dragged task, removed from source and save destination column index
      allColumns.forEach((column, i) => {
        if (isEqual(action.sourceColumnId, column._id)) {
          const index = column.tasks!.findIndex(
            (task) => task._id === action.taskId,
          );
          addedTask = column.tasks!.slice(index, index + 1)[0];
          column.tasks!.splice(index, 1);
        }
        if (isEqual(action.destinationColumnId, column._id)) {
          destCol = i;
        }
      });
      allColumns[destCol].tasks!.splice(
        action.taskIndexOfDestinationColumn,
        0,
        addedTask,
      );
      yield put({ type: DRAG_AND_DROP_TASK, payload: allColumns });
      yield tigrowApi.post(`tasks/dragTask`, requestData, headers);
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
}

function* addTeamMembersIntoBoard(action) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.put(
        `boards/${action.boardId}/members`,
        { memberId: action.members },
        headers,
      );
      yield put({
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

function* updateTask(action) {
  try {
    const headers = tokenConfig();
    let res;
    const selectTaskId = (state) =>
      state.boardIndexReducer.boardReducer.currentTask._id;
    const taskId = yield select(selectTaskId);
    if ((headers as any).headers.Authorization) {
      res = yield tigrowApi.put(`tasks/${taskId}`, action.task, headers);
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
      yield put({ type: UPDATE_TASK, payload: response });
      yield put({
        type: board.RESPONSE_STATUS_CODE,
        payload: res.status
      });
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
}

export default function* boardSaga() {
  yield all([
    takeEvery(board.CREATE_BOARD_LOAD, createBoard),
    takeLatest(board.GET_ALL_BOARDS_LOAD, getAllBoards),
    // takeLatest(board.SELECT_BOARD_LOAD, getSelectedBoard),
    takeLatest(board.CREATE_COLUMN_LOAD, createColumn),
    takeLatest(board.UPDATE_COLUMN_LOAD, updateColumn),
    takeLatest(board.CREATE_TASK_LOAD, createTask),
    takeLatest(board.DRAG_AND_DROP_TASK_LOADING, dragAndDropTask),
    takeLatest(board.ADD_TEAM_MEMBER_IN_BOARD_LOAD, addTeamMembersIntoBoard),
    takeLatest(board.UPDATE_TASK_LOAD, updateTask)

  ]);
}