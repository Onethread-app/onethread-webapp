import {
  GET_VIDEO_CONFERENCE_SUCCESS,
  GET_VIDEO_CONFERENCE_FAIL,
  GET_VIDEO_CONFERENCE_MAIN,
} from './Types';
import { takeLatest, put, call } from 'redux-saga/effects';
import AxiosServices from '../../networks/AxiosService';
import ApiServices from '../../networks/ApiServices';
import Toaster from '../toast/Types';

function* videoConferences(actions) {
  try {
    const result = yield call(
      AxiosServices.get,
      ApiServices.VIDEO_CONFERENCES_API,
      actions.body,
    );
    yield put({
      type: GET_VIDEO_CONFERENCE_SUCCESS,
      result: result.data,
    });
  } catch (err) {
    yield put({
      type: GET_VIDEO_CONFERENCE_FAIL,
      error: 'something went wrong',
    });
    yield put({
      type: Toaster.TOAST.FAILURE,
      result: 'Ops! something went wrong!',
    });
  }
}

export default function* videoConferencesSaga() {
  yield takeLatest(GET_VIDEO_CONFERENCE_MAIN, videoConferences);
}
