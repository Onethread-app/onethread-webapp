import {
  all,
  put,
  call,
  select,
  takeLatest,
  takeEvery,
} from 'redux-saga/effects';

import { tokenConfig } from 'stores/UtilsActions';
import { tigrowApi } from 'config';

import handleError from 'helpers/HandleSagaErrors';
import { errorMessgeHandler } from 'components/final-form/utils';

import { SubtaskActionTypes } from './Types';
import { getCurrentTaskId } from 'stores/taskMembers/Selector';
import { getProjectId } from 'stores/project/Selector';
import {
  createSubTaskFailure,
  createSubTaskSuccess,
  deleteSubTaskFailure,
  deleteSubTaskSuccess,
  getAllSubTask,
  getAllSubTaskFailure,
  getAllSubTaskSuccess,
  updateSubTaskFailure,
  updateSubTaskSuccess,
} from './Actions';

function* createSubtaskAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    const taskId = yield select(getCurrentTaskId);
    const projectId = yield select(getProjectId);
    const reqBody = {
      ...payload,
      taskId,
    };

    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.post(
        `subtasks?pid=${projectId}`,
        reqBody,
        headers,
      );
      yield all([
        put(createSubTaskSuccess(response.data)),
        put(getAllSubTask()),
      ]);
    }
  } catch (error) {
    errorMessgeHandler(error);
    handleError(error, async (errorMessage: any) => {
      await createSubTaskFailure(errorMessage);
    });
  }
}

function* getAllSubTaskAsync() {
  try {
    const headers = tokenConfig();
    const taskId = yield select(getCurrentTaskId);
    const projectId = yield select(getProjectId);

    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `subTasks?taskId=${taskId}&pid=${projectId}`,
        headers,
      );

      yield put(getAllSubTaskSuccess(response.data));
    }
  } catch (error) {
    handleError(error, async (errorMessage: any) => {
      await getAllSubTaskFailure(errorMessage);
    });
  }
}

function* updateSubTaskAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    const projectId = yield select(getProjectId);
    const reqBody = {
      name: payload.name,
      done: payload.done,
    };

    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.put(
        `subTasks/${payload._id}?pid=${projectId}`,
        reqBody,
        headers,
      );
      yield put(updateSubTaskSuccess(response.data));
    }
  } catch (error) {
    errorMessgeHandler(error);
    handleError(error, async (errorMessage: any) => {
      await updateSubTaskFailure(errorMessage);
    });
  }
}

function* deleteSubTaskAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    const projectId = yield select(getProjectId);

    if ((headers as any).headers.Authorization) {
      yield tigrowApi.delete(
        `subTasks/${payload._id}?pid=${projectId}`,
        headers,
      );
      yield put(deleteSubTaskSuccess(payload._id));
    }
  } catch (error) {
    handleError(error, async (errorMessage: any) => {
      await deleteSubTaskFailure(errorMessage);
    });
  }
}

function* onCreateSubTask() {
  yield takeEvery(
    SubtaskActionTypes.CREATE_SUBTASK_START,
    createSubtaskAsync,
  );
}

function* onGetAllSubTask() {
  yield takeLatest(
    SubtaskActionTypes.GET_ALL_SUBTASK_START,
    getAllSubTaskAsync,
  );
}

function* onUpdateSubTask() {
  yield takeEvery(
    SubtaskActionTypes.UPDATE_SUBTASK_START,
    updateSubTaskAsync,
  );
}

function* onDeleteSubTask() {
  yield takeEvery(
    SubtaskActionTypes.DELETE_SUBTASK_START,
    deleteSubTaskAsync,
  );
}

export default function* subtaskSaga() {
  yield all([
    call(onCreateSubTask),
    call(onGetAllSubTask),
    call(onUpdateSubTask),
    call(onDeleteSubTask),
  ]);
}
