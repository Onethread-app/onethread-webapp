import { all, put, call, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';

import {
  tokenConfig,
  tokenConfigFIleUpload,
} from 'stores/UtilsActions';
import { BoardActionTypes } from './Types';
import { TaskBoard, ITask } from './Reducer';
import { errorMessgeHandler } from 'components/final-form/utils';
import { tigrowApi } from 'config';
import { Toaster } from '@blueprintjs/core';
import {
  createBoardFailure,
  createBoardSuccess,
  getAllBoardsSuccess,
  getAllBoardsFailure,
  getSelectedBoardSuccess,
  getSelectedBoardFailure,
  createColumnSuccess,
  updateColumnSuccess,
  updateColumnFailure,
  createTaskSuccess,
  createTaskFailure,
  dragAndDropTaskSuccess,
  addTeamMembersIntoBoardFailure,
  addTeamMembersIntoBoardSuccess,
  getSelectedTaskDetailsFailure,
  getSelectedTaskDetailsSuccess,
  updateTaskFailure,
  updateTaskSuccess,
  getAllBoards,
  deleteTaskFailure,
  deleteTaskSuccess,
  taskFileUploadFailure,
  taskFileUploadSuccess,
  taskFileDeleteFailure,
  taskFileDeleteSuccess,
  getSelectedTaskDetails,
  updateBoardLoading,
  updateTaskLoading,
} from './Actions';
import { getProjectId } from 'stores/project/Selector';
import { getCompanyId } from 'stores/company/Selector';
import {
  getCurrentBoard,
  getCurrentTask,
  selectColumnName,
} from './Selector';
import handleError from 'helpers/HandleSagaErrors';

const takeEvery: any = Eff.takeEvery;
const takeLatest: any = Eff.takeLatest;

export function* createBoard({ payload }: any) {
  try {
    const headers = tokenConfig();
    const projectId = yield select(getProjectId);
    if ((headers as any).headers.Authorization) {
      const requestBody = {
        ...payload,
        projectId,
      };
      const response = yield tigrowApi.post(
        `boards?pid=${projectId}`,
        requestBody,
        headers,
      );
      yield all([
        put(createBoardSuccess(response.data)),
        put(getAllBoards()),
      ]);
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(createBoardFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        createBoardFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(createBoardFailure(error.message));
    }
  }
}

export function* getAllBoardsAsync() {
  try {
    const headers = tokenConfig();
    const projectId = yield select(getProjectId);
    if (projectId) {
      if ((headers as any).headers.Authorization) {
        const response = yield tigrowApi.get(
          `boards/boardProject?pid=${projectId}`,
          headers,
        );
        yield put(getAllBoardsSuccess(response.data));
      }
    } else {
      yield put(getAllBoardsFailure('Project ID not found'));
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(getAllBoardsFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        getAllBoardsFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(getAllBoardsFailure(error.message));
    }
  }
}

export function* getSelectedBoard({ payload }: any) {
  try {
    const currentBoardId = yield select(getCurrentBoard);
    const headers = tokenConfig();
    const projectId = yield select(getProjectId);
    if (payload !== currentBoardId && projectId) {
      if ((headers as any).headers.Authorization && payload) {
        const response = yield tigrowApi.get(
          `boards/${payload}?pid=${projectId}`,
          headers,
        );
        yield put(getSelectedBoardSuccess(response.data));
      }
    } else {
      yield put(updateBoardLoading(false));
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(getSelectedBoardFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        getSelectedBoardFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(getSelectedBoardFailure(error.message));
    }
  }
}

export function* createColumn({ payload }: any) {
  try {
    const { name } = payload;
    const newPayload = {
      type: name.toLowerCase(),
      ...payload,
    };
    const headers = tokenConfig();
    const projectId = yield select(getProjectId);
    const response = yield tigrowApi.post(
      `boardColumns?pid=${projectId}`,
      newPayload,
      headers,
    );
    yield put(createColumnSuccess(response.data));
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(createBoardFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        createBoardFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(createBoardFailure(error.message));
    }
  }
}

export function* updateColumn({ payload }: any) {
  try {
    const headers = tokenConfig();
    const projectId = yield select(getProjectId);
    const companyId = yield select(getCompanyId);
    if ((headers as any).headers.Authorization) {
      if (companyId) {
        const response = yield tigrowApi.put(
          `boardColumns/${payload._id}?pid=${projectId}`,
          payload,
          headers,
        );
        yield put(updateColumnSuccess(response.data));
      }
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(updateColumnFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        updateColumnFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(updateColumnFailure(error.message));
    }
  }
}

export function* createTask({ payload }: any) {
  try {
    const headers = tokenConfig();
    const projectId = yield select(getProjectId);
    const { columnId } = payload;
    const col = yield select(selectColumnName(columnId));
    const newPayload = {
      status: col[0].name.toLowerCase().split(' ').join('-'),
      ...payload,
    };
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.post(
        `tasks?pid=${projectId}`,
        newPayload,
        headers,
      );
      const responseValue = {
        ...response.data,
        columnId: payload.columnId,
      };
      yield put(createTaskSuccess(responseValue));
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(createTaskFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        createTaskFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(createTaskFailure(error.message));
    }
  }
}

export function* dragAndDrop({
  taskId,
  sourceColumnId,
  destinationColumnId,
  taskIndexOfDestinationColumn,
}: any) {
  try {
    const headers = tokenConfig();
    const currentBoard: TaskBoard = yield select(getCurrentBoard);
    const destColumn = yield select(
      selectColumnName(destinationColumnId),
    );
    const status = destColumn[0].name
      .toLowerCase()
      .split(' ')
      .join('-');
    if ((headers as any).headers.Authorization) {
      const requestData = {
        taskId,
        status,
        sourceColumnId,
        destinationColumnId,
        taskIndexOfDestinationColumn,
      };
      const allColumns = currentBoard.columns!;
      let addedTask: ITask = {} as any;
      let destCol = 0;

      // find the dragged task, removed from source and save destination column index
      allColumns.forEach((column, i) => {
        if (sourceColumnId === column._id) {
          const index = column.tasks!.findIndex(
            (task) => task._id === taskId,
          );
          addedTask = column.tasks!.slice(index, index + 1)[0];
          column.tasks!.splice(index, 1);
        }
        if (destinationColumnId === column._id) {
          destCol = i;
        }
      });
      allColumns[destCol].tasks!.splice(
        taskIndexOfDestinationColumn,
        0,
        addedTask,
      );
      yield put(dragAndDropTaskSuccess(allColumns));
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

export function* addTeamMembersIntoBoard({ members, boardId }: any) {
  try {
    const headers = tokenConfig();
    const projectId = yield select(getProjectId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.put(
        `boards/${boardId}/members?pid=${projectId}`,
        { memberId: members },
        headers,
      );
      yield put(addTeamMembersIntoBoardSuccess(response.data));
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(addTeamMembersIntoBoardFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        addTeamMembersIntoBoardFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(addTeamMembersIntoBoardFailure(error.message));
    }
  }
}

export function* getSelectedTaskDetailsAsync({ payload }: any) {
  try {
    const currentTaskId = yield select(getCurrentTask);
    const headers = tokenConfig();
    const projectId = yield select(getProjectId);
    if (payload !== currentTaskId && projectId) {
      if ((headers as any).headers.Authorization && payload) {
        const res = yield tigrowApi.get(
          `tasks/${payload}?pid=${projectId}`,
          headers,
        );
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
          columnId: res.data.columnId._id,
          file: res.data.file,
        };
        yield put(getSelectedTaskDetailsSuccess(response));
      }
    } else {
      yield put(updateTaskLoading(false));
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(getSelectedTaskDetailsFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        getSelectedTaskDetailsFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(getSelectedTaskDetailsFailure(error.message));
    }
  }
}

export function* updateTask({ payload }: any) {
  try {
    const headers = tokenConfig();
    const taskId = yield select(getCurrentTask);
    const projectId = yield select(getProjectId);
    if ((headers as any).headers.Authorization) {
      const res = yield tigrowApi.put(
        `tasks/${taskId}?pid=${projectId}`,
        payload,
        headers,
      );
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
      yield put(updateTaskSuccess(response));
    }
  } catch (error) {
    errorMessgeHandler(error);
    yield put(updateTaskFailure(error.message));
  }
}

export function* taskFileUploadAsync({ payload }: any) {
  try {
    const headers = tokenConfigFIleUpload();
    if ((headers as any).headers.Authorization) {
      const res = yield tigrowApi.put(
        `files/file-upload-task?taskId=${payload.taskId}`,
        payload.file,
        headers,
      );
      const response = {
        _id: res.data._id,
        taskId: res.data.task,
        link: res.data.link,
        s3Key: res.data.s3key,
        columnId: payload.columnId,
      };
      yield all([
        put(taskFileUploadSuccess(response)),
        put(getSelectedTaskDetails(payload.taskId)),
      ]);
    }
  } catch (error) {
    handleError(error, async (errorMessage: any) => {
      await taskFileUploadFailure(errorMessage);
    });
  }
}

export function* taskFileDeleteAsync({ payload }: any) {
  try {
    const reqBody = {
      fileId: payload.fileId,
      taskId: payload.taskId,
    };
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      yield tigrowApi.put(`files/file-delete-task`, reqBody, headers);
      yield all([
        put(taskFileDeleteSuccess(payload)),
        put(getSelectedTaskDetails(payload.taskId)),
      ]);
    }
  } catch (error) {
    handleError(error, async (errorMessage: any) => {
      await taskFileDeleteFailure(errorMessage);
    });
  }
}

export function* deleteTaskAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    const projectId = yield select(getProjectId);
    if ((headers as any).headers.Authorization && payload) {
      const response = yield tigrowApi.delete(
        `tasks/${payload.taskId}?pid=${projectId}`,
        {
          data: {
            columnId: payload.columnId,
          },
          headers: headers.headers,
        },
      );
      if (response.status === 200) {
        yield put(deleteTaskSuccess(payload));
      }
    }
  } catch (error) {
    handleError(error, async (errorMessage: any) => {
      await deleteTaskFailure(errorMessage);
    });
  }
}

export function* onCreateBoard() {
  yield takeEvery(BoardActionTypes.CREATE_BOARD_START, createBoard);
}

export function* onGetAllBoards() {
  yield takeEvery(
    BoardActionTypes.GET_ALL_BOARDS_START,
    getAllBoardsAsync,
  );
}

export function* onGetSelectedBoard() {
  yield takeLatest(
    BoardActionTypes.SELECT_BOARD_START,
    getSelectedBoard,
  );
}

export function* onCreateColumn() {
  yield takeEvery(BoardActionTypes.CREATE_COLUMN_START, createColumn);
}

export function* onUpdateColumn() {
  yield takeEvery(BoardActionTypes.UPDATE_COLUMN_START, updateColumn);
}

export function* onAddTeamMembersIntoBoard() {
  yield takeEvery(
    BoardActionTypes.ADD_TEAM_MEMBER_IN_BOARD_START,
    addTeamMembersIntoBoard,
  );
}

export function* onCreateTask() {
  yield takeEvery(BoardActionTypes.CREATE_TASK_START, createTask);
}

export function* onDragAndDrop() {
  yield takeEvery(
    BoardActionTypes.DRAG_AND_DROP_TASK_START,
    dragAndDrop,
  );
}

export function* onSelectTask() {
  yield takeLatest(
    BoardActionTypes.SELECT_TASK_START,
    getSelectedTaskDetailsAsync,
  );
}

export function* onUpdateTask() {
  yield takeLatest(BoardActionTypes.UPDATE_TASK_START, updateTask);
}

export function* onTaskFileUpload() {
  yield takeEvery(
    BoardActionTypes.TASK_FILE_UP_START,
    taskFileUploadAsync,
  );
}

export function* onTaskFileDelete() {
  yield takeEvery(
    BoardActionTypes.TASK_FILE_DELETE_START,
    taskFileDeleteAsync,
  );
}

export function* onDeleteTask() {
  yield takeEvery(
    BoardActionTypes.DELETE_TASK_START,
    deleteTaskAsync,
  );
}

export default function* boardSaga() {
  yield all([
    call(onCreateBoard),
    call(onGetAllBoards),
    call(onGetSelectedBoard),
    call(onCreateColumn),
    call(onUpdateColumn),
    call(onCreateTask),
    call(onDragAndDrop),
    call(onAddTeamMembersIntoBoard),
    call(onSelectTask),
    call(onUpdateTask),
    call(onTaskFileUpload),
    call(onTaskFileDelete),
    call(onDeleteTask),
  ]);
}
