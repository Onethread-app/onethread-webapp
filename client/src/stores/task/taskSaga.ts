import { all, put, call, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';

import {
  formTokenConfig,
  tokenConfig,
  tokenConfigFIleUpload,
} from 'stores/UtilsActions';
import { TaskActionType } from './Types';
import { errorMessgeHandler } from 'components/final-form/utils';
import { tigrowApi } from 'config';
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
  getAllUserTasksSuccess,
  getAllUserTasksFailure,
  getAllCompanyTasksFailure,
  getAllCompanyTasksSuccess,
  getAllProjectTasksSuccess,
  getAllProjectTasksFailure,
  createTaskStatusSuccess,
  createTaskStatusFailure,
  getAllTaskStatusInProjectSuccess,
  getAllTaskStatusInProjectFailure,
  updateTaskStatusFailure,
  createSubTaskSuccess,
  createSubTaskFailure,
  taskMarkAsCompletedSuccess,
  taskMarkAsCompletedFailure,
} from './Actions';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { getProjectId } from 'stores/project/Selector';
import { getCompanyId } from 'stores/company/Selector';
import { getCurrentBoard } from './Selector';
import { returnErrorText } from 'helpers/HandleSagaErrors';
import { updateUserCompanyTask } from 'stores/user/Actions';

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

function* getAllCompanyTasksAsync() {
  yield put(showLoading());
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    if ((headers.headers as any).Authorization) {
      const response = yield tigrowApi.get(
        `/company/${companyId}/all-tasks`,
        headers,
      );
      yield put(getAllCompanyTasksSuccess(response.data.tasks));
    }
  } catch (error) {
    yield put(getAllCompanyTasksFailure(returnErrorText(error)));
  } finally {
    yield put(hideLoading());
  }
}

function* getAllProjectTasksAsync() {
  try {
    const headers = tokenConfig();
    const projectId = yield select(getProjectId);
    if ((headers.headers as any).Authorization) {
      const response = yield tigrowApi.get(
        `/projects/tasks?pid=${projectId}`,
        headers,
      );
      yield put(getAllProjectTasksSuccess(response.data));
    }
  } catch (error) {
    yield put(getAllProjectTasksFailure(returnErrorText(error)));
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
    const { companyId, projectId, ...newPayload } = payload;
    const headers = formTokenConfig(companyId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.post(
        `tasks?pid=${projectId}`,
        newPayload,
        headers,
      );

      const currentCompanyId = yield select(getCompanyId);
      const currentProjectId = yield select(getProjectId);
      yield put(
        createTaskSuccess({
          task: {
            ...response.data,
          },
          currentCompanyId,
          currentProjectId,
        }),
      );
      yield put(updateUserCompanyTask(companyId));
    }
  } catch (error) {
    yield put(
      createTaskFailure(returnErrorText(error) || 'Unknown error'),
    );
  }
}

export function* dragAndDrop({
  taskId,
  companyId,
  destinationStatusId,
  sourceStatusId,
}: any) {
  try {
    const headers = formTokenConfig(companyId);
    if ((headers as any).headers.Authorization) {
      yield tigrowApi.post(
        `tasks/dragTask`,
        { sourceStatusId, destinationStatusId, taskId },
        headers,
      );
    }
    yield put(
      dragAndDropTaskSuccess({ taskId, destinationStatusId }),
    );
  } catch (error) {
    const errorText = returnErrorText(error);

    // TODO: send errorText to error toaster
    yield put(dragAndDropTaskFailure(errorText));
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
    const { companyId, projectId, taskId } = payload;
    const headers = formTokenConfig(companyId);
    if ((headers as any).headers.Authorization && payload) {
      const res = yield tigrowApi.get(
        `tasks/${taskId}?pid=${projectId}`,
        headers,
      );
      yield put(getSelectedTaskDetailsSuccess(res.data));
    }
  } catch (error) {
    yield put(getSelectedTaskDetailsFailure(returnErrorText(error)));
  } finally {
    yield put(hideLoading());
  }
}

export function* updateTask({ payload }: any) {
  try {
    const { companyId, projectId, taskId, ...newPayload } = payload;
    const headers = formTokenConfig(companyId);
    if ((headers as any).headers.Authorization) {
      const res = yield tigrowApi.put(
        `tasks/${taskId}?pid=${projectId}`,
        newPayload,
        headers,
      );
      yield put(
        updateTaskSuccess({
          updatedTask: res.data.task,
        }),
      );
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
        columnId: payload.columnId, // need to change
      };
      const companyId = yield select(getCompanyId);
      const projectId = yield select(getProjectId);
      yield all([
        put(taskFileUploadSuccess(response)),
        put(
          getSelectedTaskDetails({
            taskId: payload.taskId,
            companyId,
            projectId,
          }),
        ),
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
      const companyId = yield select(getCompanyId);
      const projectId = yield select(getProjectId);
      yield all([
        put(taskFileDeleteSuccess(payload)),
        put(
          getSelectedTaskDetails({
            taskId: payload.taskId,
            companyId,
            projectId,
          }),
        ),
      ]);
    }
  } catch (error) {
    yield put(taskFileDeleteFailure(returnErrorText(error)));
  }
}

export function* deleteTaskAsync({ payload }: any) {
  try {
    const { taskId, projectId, companyId, parentTask } = payload;
    const headers = formTokenConfig(companyId);
    if ((headers as any).headers.Authorization && payload) {
      const response = yield tigrowApi.delete(
        `tasks/${taskId}?pid=${projectId}`,
        headers,
      );
      if (response.status === 200) {
        yield put(deleteTaskSuccess({ taskId, parentTask }));
      }
    }
  } catch (error) {
    yield put(deleteTaskFailure(returnErrorText(error)));
  }
}

export function* createTaskStatusAsync({ payload }: any) {
  try {
    const { projectId, companyId, ...newPayload } = payload;
    const headers = formTokenConfig(companyId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.post(
        `taskStatus?pid=${projectId}`,
        newPayload,
        headers,
      );
      yield put(createTaskStatusSuccess(response.data));
    }
  } catch (error) {
    yield put(createTaskStatusFailure(returnErrorText(error)));
  }
}

export function* getAllTaskStatusInProjectAsync({ payload }: any) {
  try {
    const { projectId, companyId } = payload;
    const headers = formTokenConfig(companyId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `taskStatus?pid=${projectId}`,
        headers,
      );
      yield put(getAllTaskStatusInProjectSuccess(response.data));
    }
  } catch (error) {
    yield put(
      getAllTaskStatusInProjectFailure(returnErrorText(error)),
    );
  }
}

export function* updateTaskStatusAsync({ payload }: any) {
  try {
    const { projectId, companyId, taskStatusId, ...newPayload } =
      payload;
    const headers = formTokenConfig(companyId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.put(
        `taskStatus/${taskStatusId}?pid=${projectId}`,
        newPayload,
        headers,
      );
      yield put(updateTaskSuccess(response.data));
    }
  } catch (error) {
    yield put(updateTaskStatusFailure(returnErrorText(error)));
  }
}

export function* createSubTask(action) {
  try {
    const { projectId, companyId, taskId, ...newPayload } =
      action.payload;
    const headers = formTokenConfig(companyId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.post(
        `tasks/${taskId}/subtask?pid=${projectId}`,
        newPayload,
        headers,
      );
      yield put(createSubTaskSuccess(response.data));
    }
  } catch (error) {
    // console.log(error);
    yield put(createSubTaskFailure(returnErrorText(error)));
  }
}

export function* taskMarkAsCompleted({ payload }: any) {
  try {
    const { projectId, companyId, taskId } = payload;
    const headers = formTokenConfig(companyId);
    if ((headers as any).headers.Authorization) {
      yield tigrowApi.post(
        `tasks/${taskId}/mark-as-completed?pid=${projectId}`,
        {},
        headers,
      );
      yield put(
        taskMarkAsCompletedSuccess({
          projectId,
          companyId,
          updatedTask: { _id: taskId, isCompleted: true },
        }),
      );
    }
  } catch (error) {
    yield put(taskMarkAsCompletedFailure(returnErrorText(error)));
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

export function* onGetAllCompanyTasks() {
  yield takeLatest(
    TaskActionType.GET_ALL_TASKS_FOR_COMPANY_START,
    getAllCompanyTasksAsync,
  );
}

export function* onGetAllProjectTasks() {
  yield takeLatest(
    TaskActionType.GET_ALL_TASKS_FOR_PROJECT_START,
    getAllProjectTasksAsync,
  );
}

export function* onGetSelectedBoard() {
  yield takeEvery(
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

export function* onCreateTaskStatus() {
  yield takeEvery(
    TaskActionType.CREATE_TASK_STATUS,
    createTaskStatusAsync,
  );
}

export function* onGetAllTaskStatusInProject() {
  yield takeEvery(
    TaskActionType.GET_ALL_TASK_STATUS,
    getAllTaskStatusInProjectAsync,
  );
}

export function* onUpdateTaskStatus() {
  yield takeEvery(
    TaskActionType.UPDATE_TASK_STATUS,
    updateTaskStatusAsync,
  );
}

export function* onCreateSubTask() {
  yield takeEvery(TaskActionType.CREATE_SUBTASK, createSubTask);
}

export function* onTaskMarkAsCompleted() {
  yield takeEvery(
    TaskActionType.TASK_MARK_AS_COMPLETED,
    taskMarkAsCompleted,
  );
}

export default function* taskSaga() {
  yield all([
    call(onCreateBoard),
    call(onGetAllBoards),
    call(onGetAllUserTasks),
    call(onGetAllCompanyTasks),
    call(onGetAllProjectTasks),
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
    call(onCreateTaskStatus),
    call(onGetAllTaskStatusInProject),
    call(onUpdateTaskStatus),
    call(onCreateSubTask),
  ]);
}
