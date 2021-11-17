import {
  all,
  put,
  call,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';

import TimeTrackerTypes from './Types';

import { formTokenConfig, tokenConfig } from 'stores/UtilsActions';
import { tigrowApi } from 'config';
import { returnErrorText } from 'helpers/HandleSagaErrors';

import {
  addTrackedTimeFailure,
  addTrackedTimeSuccess,
  getTaskTrackersFailure,
  getTaskTrackersSuccess,
} from './Action';
import { updateTaskTimeSpent } from 'stores/task/Actions';
import { updateProjectTimeSpent } from 'stores/project/Actions';
import { getCurrentTaskId } from 'stores/task/Selector';

function* addTrackedTimeAsync({ payload }: any) {
  try {
    const { project, company, ...newPayload } = payload;
    const headers = formTokenConfig(company);
    if ((headers as any).headers.Authorization) {
      const res = yield tigrowApi.post(
        `time-trackers?pid=${project}`,
        newPayload,
        headers,
      );
      yield all([
        put(updateProjectTimeSpent(res.data.timeTracker)),
        put(updateTaskTimeSpent(res.data.timeTracker)),
        put(addTrackedTimeSuccess(res.data.timeTracker)),
      ]);
    }
  } catch (error) {
    yield put(addTrackedTimeFailure(returnErrorText(error)));
  }
}

function* getTaskTrackersAsync(action) {
  try {
    const currentTaskId = yield select(getCurrentTaskId);
    const headers = formTokenConfig(action.payload);
    if ((headers as any).headers.Authorization) {
      const res = yield tigrowApi.get(
        `time-trackers/task/${currentTaskId}`,
        headers,
      );
      yield put(getTaskTrackersSuccess(res.data));
    }
  } catch (error) {
    yield put(getTaskTrackersFailure(returnErrorText(error)));
  }
}

function* getTaskTrackersByUserAsync() {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const res = yield tigrowApi.get(`time-trackers/user`, headers);
      yield put(getTaskTrackersSuccess(res.data));
    }
  } catch (error: any) {
    yield put(getTaskTrackersFailure(returnErrorText(error)));
  }
}

function* onAddTrackedTime() {
  yield takeEvery(
    TimeTrackerTypes.ADD_TRACKED_TIME_START,
    addTrackedTimeAsync,
  );
}

function* onGetTaskTrackers() {
  yield takeLatest(
    TimeTrackerTypes.GET_TRACKED_TIME_LIST_FOR_TASK_START,
    getTaskTrackersAsync,
  );
}

function* onGetTaskTrackersByUser() {
  yield takeLatest(
    TimeTrackerTypes.USER_TIME_TRACKER,
    getTaskTrackersByUserAsync,
  );
}

export default function* timeTrackerSaga() {
  yield all([
    call(onAddTrackedTime),
    call(onGetTaskTrackers),
    call(onGetTaskTrackersByUser),
  ]);
}
