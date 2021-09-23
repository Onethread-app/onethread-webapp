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

import { returnErrorText } from 'helpers/HandleSagaErrors';
import { errorMessgeHandler } from 'components/final-form/utils';

import { getCurrentTaskId } from 'stores/taskMembers/Selector';
import { getProjectId } from 'stores/project/Selector';
import { getCurrentBoardId } from 'stores/task/Selector';
import {
  addSubTaskMemberFailure,
  addSubTaskMemberSuccess,
  createSubTaskFailure,
  createSubTaskSuccess,
  deleteSubTaskFailure,
  deleteSubTaskMemberFailure,
  deleteSubTaskMemberSuccess,
  deleteSubTaskSuccess,
  getAllSubTask,
  getAllSubTaskFailure,
  getAllSubTaskSuccess,
  updateSubTaskFailure,
  updateSubTaskSuccess,
} from './Actions';
import { SubtaskActionTypes } from './Types';

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
    yield put(createSubTaskFailure(returnErrorText(error)));
  }
}

function* getAllSubTaskAsync() {
  try {
    const headers = tokenConfig();
    const taskId = yield select(getCurrentTaskId);
    const projectId = yield select(getProjectId);

    if (projectId && taskId) {
      if ((headers as any).headers.Authorization) {
        const response = yield tigrowApi.get(
          `subTasks?taskId=${taskId}&pid=${projectId}`,
          headers,
        );

        yield put(getAllSubTaskSuccess(response.data));
      }
    } else {
      yield put(
        getAllSubTaskFailure('Task ID or Project ID not found'),
      );
    }
  } catch (error) {
    yield put(getAllSubTaskFailure(returnErrorText(error)));
  }
}

function* updateSubTaskAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    const projectId = yield select(getProjectId);
    const reqBody = {
      name: payload.name,
      done: payload.done,
      dueDate: payload.dueDate,
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
    yield put(updateSubTaskFailure(returnErrorText(error)));
  }
}

function* addSubTaskMemberAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    const projectId = yield select(getProjectId);
    const boardId = yield select(getCurrentBoardId);
    const reqBody = {
      assignmember: payload.memberId,
      boardId,
    };
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.post(
        `subtasks/${payload._id}/member?pid=${projectId}`,
        reqBody,
        headers,
      );
      yield put(addSubTaskMemberSuccess(response.data));
    }
  } catch (error) {
    yield put(addSubTaskMemberFailure(returnErrorText(error)));
  }
}

function* deleteSubTaskMemberAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    const projectId = yield select(getProjectId);

    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.delete(
        `subtasks/${payload._id}/member?pid=${projectId}&memberId=${payload.memberId}`,

        headers,
      );
      yield put(deleteSubTaskMemberSuccess(response.data));
    }
  } catch (error) {
    yield put(deleteSubTaskMemberFailure(returnErrorText(error)));
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
    yield put(deleteSubTaskFailure(returnErrorText(error)));
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

function* onAddSubTaskMember() {
  yield takeEvery(
    SubtaskActionTypes.ADD_SUBTASK_MEMBER_START,
    addSubTaskMemberAsync,
  );
}

function* onDeleteSubTaskMember() {
  yield takeEvery(
    SubtaskActionTypes.DELETE_SUBTASK_MEMBER_START,
    deleteSubTaskMemberAsync,
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
    call(onAddSubTaskMember),
    call(onDeleteSubTaskMember),
    call(onDeleteSubTask),
  ]);
}
