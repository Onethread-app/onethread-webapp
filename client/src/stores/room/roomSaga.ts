import { all, put, select, takeLatest } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import { room, LOADING_ROOM, CREATE_ROOM_FROM_SERVER_SUCCESS, 
  GET_ROOMS, GET_ROOM_ERROR, GET_ROOM_MEMBERS,
   GET_ROOM_MEMBERS_ERROR, SEND_MESSAGE, SEND_MESSAGE_ERROR,
    ALL_MESSAGE_RECEIVED, GET_ROOM_MESSAGES, GET_ROOM_MESSAGES_ERROR, FILE_UPLOAD } from './Types';
import { tigrowApi } from 'config';
// import { isEqual } from 'lodash';
import { tokenConfig } from 'stores/UtilsActions';
// import { combineReducers } from 'redux';
// import { isEqual } from 'lodash';
// import { Associate } from './Reducer';
// import { Toaster } from '@blueprintjs/core';
import { roomSubscribe } from 'layouts/company/room/channelSubscribe';
// import { getRooms } from './Actions';
import { IRoom } from './Reducer';
import { isEqual } from 'lodash';
// import { type } from 'os';
// import { ItemEntityProps } from 'components/fields/SuggestField';
// import { Associate } from './Reducer';
// import { Toaster } from '@blueprintjs/core';

const takeEvery: any = Eff.takeEvery; // <-- new
// const takeLatest: any = Eff.takeLatest;

function* createRoomAction(action) {
  console.log('room', action);
  try {
    const selectCompanyId = (state) =>
      state.companyReducer.currentCompany._id;
    const selectProjectId = (state) =>
      state.projectReducer.projectDetails._id;
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const company = yield select(selectCompanyId);
      const project = yield select(selectProjectId);
      yield put({ type: LOADING_ROOM });
      const response = yield tigrowApi.post(
        `rooms?pid=${project}`,
        {
          ...action.roomData,
          company,
          project,
        },
        headers,
      );
      yield put({
        type: CREATE_ROOM_FROM_SERVER_SUCCESS,
        payload: response.data.room,
      });
      yield put({
        type: room.RESPONSE_STATUS_CODE,
        payload: response.status
      });
      yield roomSubscribe(response.data.room._id);
      console.log(response.status);

      // return response.status;
    }
  } catch (error) {
    console.log(error.response);
    yield put({
      type: room.RESPONSE_STATUS_CODE,
      payload: error.response.status
    });
    yield put({ type: room.CREATE_ROOM_ERROR, payload: error.response.data.errors[0].message });
    // return error.response.status;
  }
}

function* getRooms() {
  try {
    const selectCompanyId = (state) =>
      state.companyReducer.currentCompany._id;
      const selectProjectId = (state) =>
      state.projectReducer.projectDetails._id;
      const company = yield select(selectCompanyId);
      const project = yield select(selectProjectId);
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      yield put({ type: LOADING_ROOM });
      const response = yield tigrowApi.get(
        `rooms/${company}/${project}`,
        headers,
      );
      yield put({ type: GET_ROOMS, payload: response.data });
      const rooms = response.data.rooms as IRoom[];
      rooms.forEach(async (room) => {
        await roomSubscribe(room._id);
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in rooms fetching');
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      yield put({ type: GET_ROOM_ERROR, payload: 'Network error' });
    } else if (error.response.status === 401) {
      yield put({
        type: GET_ROOM_ERROR,
        payload: 'Unauthorized user',
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
  }
}

function* getRoomMembers(action) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `rooms/members/${action.roomId}`,
        headers,
      );
      yield put({
        type: GET_ROOM_MEMBERS,
        payload: response.data.members,
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in rooms members fetching');
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      yield put({
        type: GET_ROOM_MEMBERS_ERROR,
        payload: 'Network error',
      });
    } else if (error.response.status === 401) {
      yield put({
        type: GET_ROOM_MEMBERS_ERROR,
        payload: 'Unauthorized user',
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
  }
}

function* sendRoomMessage(action) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.post(
        `messages`,
        action.data,
        headers,
      );
      yield put({ type: SEND_MESSAGE });
      return response.status;
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in sending a room message');
    }
  } catch (error) {
    if (error.response.status === 401) {
      yield put({
        type: SEND_MESSAGE_ERROR,
        payload: 'Unauthorized user',
      });
    } else if (isEqual(error.message, 'Network Error')) {
      yield put({
        type: SEND_MESSAGE_ERROR,
        payload: 'Network error',
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
    return error.response.status;
  }
}

function* getRoomMessages(action) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `messages/room/${action.roomId}?limit=${action.limit}&skip=${action.skip}`,
        headers,
      );
      if (response.data.count < action.limit) {
        yield put({ type: ALL_MESSAGE_RECEIVED, payload: true });
      }
      yield put({
        type: GET_ROOM_MESSAGES,
        payload: response.data.messages.reverse(),
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in rooms message fetching');
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      yield put({
        type: GET_ROOM_MESSAGES_ERROR,
        payload: 'Network error',
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
  }
}

function* fileUploadAction(action) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.post(
        `files/file-upload-room?roomID=${action.roomID}`,
        action.imageSelected,
        headers,
      );
      yield put({ type: FILE_UPLOAD, payload: response.data.newFile });
      return response;
    } else {
      // tslint:disable-next-line: no-console
      console.log('no headers');
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
    return error.response;
  }
}

export default function* roomSaga() {
  yield all([
    takeEvery(room.CREATE_ROOM_LOAD, createRoomAction),
    takeLatest(room.GET_ROOMS_LOAD, getRooms),
    takeLatest(room.GET_ROOM_MEMBERS_LOAD, getRoomMembers),
    takeLatest(room.SEND_MESSAGE_LOAD, sendRoomMessage),
    takeLatest(room.GET_ROOM_MESSAGES_LOAD, getRoomMessages),
    takeLatest(room.FILE_UPLOAD_LOAD, fileUploadAction),

  ]);
}