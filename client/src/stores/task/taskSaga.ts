import { all, put, call, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';

import {
  tokenConfig,
  tokenConfigFIleUpload,
} from 'stores/UtilsActions';
import { TaskActionType } from './Types';
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
  // updateTaskLoading,
  updateBoardNameFailure,
  updateBoardNameSuccess,
  dragAndDropTaskFailure,
  updateCurrentTaskColumnId,
  getAllUserTasksSuccess,
  getAllUserTasksFailure,
} from './Actions';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { getProjectId } from 'stores/project/Selector';
import { getCompanyId } from 'stores/company/Selector';
import {
  getCurrentBoard,
  getCurrentTaskId,
  selectColumnName,
} from './Selector';
import { returnErrorText } from 'helpers/HandleSagaErrors';

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
    yield put(createBoardFailure(returnErrorText(error)));
  }
}

export function* getAllBoardsAsync() {
  try {
    yield put(showLoading());
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
    yield put(getAllBoardsFailure(returnErrorText(error)));
  } finally {
    yield put(hideLoading());
  }
}

function* getAllUserTasksAsync() {
  try {
    const headers = tokenConfig();
    if ((headers.headers as any).Authorization) {
      const response = yield tigrowApi.get(
        `accounts/task-list?date=${new Date()}`,
        headers,
      );
      yield put(getAllUserTasksSuccess(response.data));
    }
  } catch (error) {
    yield put(getAllUserTasksFailure(returnErrorText(error)));
  }
}

export function* getSelectedBoard({ payload }: any) {
  try {
    yield put(showLoading());
    const headers = tokenConfig();
    const projectId = yield select(getProjectId);
    if (projectId) {
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
    yield put(getSelectedBoardFailure(returnErrorText(error)));
  } finally {
    yield put(hideLoading());
  }
}

export function* updateBoardNameAsync({ payload }: any) {
  try {
    const projectId = yield select(getProjectId);
    const currentBoard = yield select(getCurrentBoard);
    const headers = tokenConfig();
    const body = {
      name: payload,
    };
    if (currentBoard._id) {
      if (
        (headers as any).headers.Authorization &&
        payload !== currentBoard.name
      ) {
        const response = yield tigrowApi.put(
          `boards/${currentBoard._id}/update-name?pid=${projectId}`,
          body,
          headers,
        );
        yield put(updateBoardNameSuccess(response.data));
      } else yield put(updateBoardNameFailure('Same Name'));
    } else yield put(updateBoardNameFailure('No Name Included'));
  } catch (error) {
    yield put(updateBoardNameFailure(returnErrorText(error)));
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
    yield put(createBoardFailure(returnErrorText(error)));
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
    yield put(updateColumnFailure(returnErrorText(error)));
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
    yield put(createTaskFailure(returnErrorText(error)));
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
          column.tasks![index].status = status;
          column.tasks![index].columnId = destinationColumnId;
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
      const currentTaskId = yield select(getCurrentTaskId);
      if (taskId === currentTaskId) {
        yield put(
          updateCurrentTaskColumnId({
            columnId: destinationColumnId,
            status,
          }),
        );
      }
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
          window.location.reload();
        },
        text: 'Reload',
      },
      timeout: 300000,
    });
    yield put(dragAndDropTaskFailure(returnErrorText(error)));
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
    yield put(addTeamMembersIntoBoardFailure(returnErrorText(error)));
  }
}

export function* getSelectedTaskDetailsAsync({ payload }: any) {
  try {
    yield put(showLoading());
    const headers = tokenConfig();
    // const projectId = yield select(getProjectId);
    // if (projectId) {
    if ((headers as any).headers.Authorization && payload) {
      const res = yield tigrowApi.get(`tasks/${payload}`, headers);
      console.log(res);
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
        boardId: res.data.boardId,
        file: res.data.file,
        status: res.data.status,
        timeSpent: res.data.timeSpent,
      };
      yield put(getSelectedTaskDetailsSuccess(response));
    }
    // } else {
    //   yield put(updateTaskLoading(false));
    // }
  } catch (error) {
    yield put(getSelectedTaskDetailsFailure(returnErrorText(error)));
  } finally {
    yield put(hideLoading());
  }
}

export function* updateTask({ payload }: any) {
  try {
    const headers = tokenConfig();
    const taskId = yield select(getCurrentTaskId);
    const projectId = yield select(getProjectId);
    const currentBoard = yield select(getCurrentBoard);
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
        columnId: res.data.columnId._id,
      };

      const allColumns = currentBoard.columns!;
      allColumns.forEach((column, i) => {
        if (response.columnId === column._id) {
          const index = column.tasks!.findIndex(
            (task) => task._id === taskId,
          );
          column.tasks![
            index
          ].status = response.currentColumnName
            .toLowerCase()
            .split(' ')
            .join('-');
          column.tasks![index]._id = response._id;
          column.tasks![index].name = response.name;
          column.tasks![index].dueDate = response.dueDate;
          column.tasks![index].description = response.description;
          column.tasks![index].priority = response.priority;
          column.tasks![index].currentColumnName =
            response.currentColumnName;
          column.tasks![index].columnId = response.columnId;
        }
      });

      yield put(updateTaskSuccess({ allColumns, response }));
    }
  } catch (error) {
    errorMessgeHandler(error);
    yield put(updateTaskFailure(returnErrorText(error)));
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
    yield put(taskFileUploadFailure(returnErrorText(error)));
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
    yield put(taskFileDeleteFailure(returnErrorText(error)));
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
    yield put(deleteTaskFailure(returnErrorText(error)));
  }
}

export function* onCreateBoard() {
  yield takeEvery(TaskActionType.CREATE_BOARD_START, createBoard);
}

export function* onGetAllBoards() {
  yield takeEvery(
    TaskActionType.GET_ALL_BOARDS_START,
    getAllBoardsAsync,
  );
}

export function* onGetAllUserTasks() {
  yield takeLatest(
    TaskActionType.GET_ALL_USER_TASKS_START,
    getAllUserTasksAsync,
  );
}

export function* onGetSelectedBoard() {
  yield takeLatest(
    TaskActionType.SELECT_BOARD_START,
    getSelectedBoard,
  );
}

export function* onUpdateBoardName() {
  yield takeLatest(
    TaskActionType.UPDATE_BOARD_NAME_START,
    updateBoardNameAsync,
  );
}

export function* onCreateColumn() {
  yield takeEvery(TaskActionType.CREATE_COLUMN_START, createColumn);
}

export function* onUpdateColumn() {
  yield takeEvery(TaskActionType.UPDATE_COLUMN_START, updateColumn);
}

export function* onAddTeamMembersIntoBoard() {
  yield takeEvery(
    TaskActionType.ADD_TEAM_MEMBER_IN_BOARD_START,
    addTeamMembersIntoBoard,
  );
}

export function* onCreateTask() {
  yield takeEvery(TaskActionType.CREATE_TASK_START, createTask);
}

export function* onDragAndDrop() {
  yield takeEvery(
    TaskActionType.DRAG_AND_DROP_TASK_START,
    dragAndDrop,
  );
}

export function* onSelectTask() {
  yield takeLatest(
    TaskActionType.SELECT_TASK_START,
    getSelectedTaskDetailsAsync,
  );
}

export function* onUpdateTask() {
  yield takeLatest(TaskActionType.UPDATE_TASK_START, updateTask);
}

export function* onTaskFileUpload() {
  yield takeEvery(
    TaskActionType.TASK_FILE_UP_START,
    taskFileUploadAsync,
  );
}

export function* onTaskFileDelete() {
  yield takeEvery(
    TaskActionType.TASK_FILE_DELETE_START,
    taskFileDeleteAsync,
  );
}

export function* onDeleteTask() {
  yield takeEvery(TaskActionType.DELETE_TASK_START, deleteTaskAsync);
}

export default function* taskSaga() {
  yield all([
    call(onCreateBoard),
    call(onGetAllBoards),
    call(onGetAllUserTasks),
    call(onGetSelectedBoard),
    call(onUpdateBoardName),
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
