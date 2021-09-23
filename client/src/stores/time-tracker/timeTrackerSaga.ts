import {
  all,
  put,
  call,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';

import { tokenConfig } from 'stores/UtilsActions';
import { tigrowApi } from 'config';
import { returnErrorText } from 'helpers/HandleSagaErrors';

import { updateTaskTimeSpent } from 'stores/task/Actions';
import { updateProjectTimeSpent } from 'stores/project/Actions';
import { getCurrentTaskId } from 'stores/task/Selector';
import {
  addTrackedTimeFailure,
  addTrackedTimeSuccess,
  getTaskTrackersFailure,
  getTaskTrackersSuccess,
} from './Action';
import TimeTrackerTypes from './Types';

function* addTrackedTimeAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const res = yield tigrowApi.post('track/', payload, headers);
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

function* getTaskTrackersAsync() {
  try {
    const currentTaskId = yield select(getCurrentTaskId);
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const res = yield tigrowApi.get(
        `track/task?taskId=${currentTaskId}`,
        headers,
      );
      yield put(getTaskTrackersSuccess(res.data));
    }
  } catch (error) {
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

export default function* timeTrackerSaga() {
  yield all([call(onAddTrackedTime), call(onGetTaskTrackers)]);
}
