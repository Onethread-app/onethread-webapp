import { all, call, put, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import {
  room,
  // LOADING_ROOM,
  ALL_MESSAGE_RECEIVED,
  RoomActionTypes,
  CURRENT_ROOM,
} from './Types';
import { tigrowApi } from 'config';
import { formTokenConfig, tokenConfig } from 'stores/UtilsActions';
import { roomSubscribe } from 'layouts/company/room/channelSubscribe';
import { IRoom } from './Reducer';
import {
  addRoomMembersFailure,
  addRoomMembersSuccess,
  archiveRoomFailure,
  archiveRoomSuccess,
  createRoomFailure,
  createRoomSuccess,
  fetchChatsFailure,
  fetchChatsSuccess,
  fetchRoomsFailure,
  fetchRoomsSuccess,
  fileUploadActionFailure,
  fileUploadActionSuccess,
  getRoomDiscussionsFailure,
  getRoomDiscussionsSuccess,
  getRoomMembersFailure,
  getRoomMembersSuccess,
  getRoomMessagesFailure,
  getRoomMessagesSuccess,
  getRoomsFailure,
  getRoomSharedFilesFailure,
  getRoomSharedFilesSuccess,
  getRoomsSuccess,
  removeRoomDiscussion,
  sendRoomMessageFailure,
  sendRoomMessageSuccess,
  setRoomLoading,
  toggleDiscussionRoomFailure,
  toggleDiscussionRoomSuccess,
  updateLastSeenFailure,
  updateLastSeenSuccess,
} from './Actions';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { returnErrorText } from 'helpers/HandleSagaErrors';
import { getProjectId } from 'stores/project/Selector';

const takeEvery: any = Eff.takeEvery; // <-- new
const takeLatest: any = Eff.takeLatest;

function* createRoom({ payload }) {
  try {
    const { companyId, projectId } = payload;
    const headers = formTokenConfig(companyId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.post(
        `rooms?pid=${projectId}`,
        { name: payload.name },
        headers,
      );
      console.log(response);
      yield all([
        put(setRoomLoading(true)),
        put(createRoomSuccess(response.data.room)),
        put({
          type: room.RESPONSE_STATUS_CODE,
          payload: response.status,
        }),
        put({ type: CURRENT_ROOM, payload: response.data.room }),
      ]);
      yield roomSubscribe(response.data.room._id);
    }
  } catch (error: any) {
    yield put(createRoomFailure(returnErrorText(error)));
    yield put({
      type: room.RESPONSE_STATUS_CODE,
      payload: error.response.status,
    });
  }
}

function* getRooms() {
  try {
    yield put(showLoading());
    const projectId = yield select(getProjectId);
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `rooms/list?pid=${projectId}`,
        headers,
      );
      yield put(getRoomsSuccess(response.data));
      const rooms = response.data.rooms as IRoom[];
      rooms.forEach(async (room) => {
        await roomSubscribe(room._id);
      });
    }
  } catch (error) {
    yield put(getRoomsFailure(returnErrorText(error)));
  } finally {
    yield put(hideLoading());
  }
}

function* getRoomMembers({ payload }) {
  try {
    yield put(showLoading());
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `rooms/members/${payload}`,
        headers,
      );
      yield put(getRoomMembersSuccess(response.data.members));
    }
  } catch (error) {
    yield put(getRoomMembersFailure(returnErrorText(error)));
  } finally {
    yield put(hideLoading());
  }
}

function* addRoomMembers({ data, selectedRoomMember }) {
  try {
    const projectId = yield select(getProjectId);
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.post(
        `rooms/addUser?pid=${projectId}`,
        data,
        headers,
      );
      if (response.status === 201) {
        yield put(addRoomMembersSuccess(selectedRoomMember));
      }
      yield put({
        type: room.RESPONSE_STATUS_CODE,
        payload: response.status,
      });
    }
  } catch (error: any) {
    yield put(addRoomMembersFailure(returnErrorText(error)));
    yield put({
      type: room.RESPONSE_STATUS_CODE,
      payload: error.response.status,
    });
  }
}

function* sendRoomMessage({ payload }) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      yield tigrowApi.post(`messages`, payload, headers);
      yield put(sendRoomMessageSuccess());
    }
  } catch (error) {
    yield put(sendRoomMessageFailure(returnErrorText(error)));
  }
}

function* getRoomMessages({ roomId, limit, skip }) {
  try {
    yield put(showLoading());
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `messages/room/${roomId}?limit=${limit}&skip=${skip}`,
        headers,
      );
      if (response.data.count < limit) {
        yield put({ type: ALL_MESSAGE_RECEIVED, payload: true });
      }
      yield put(
        getRoomMessagesSuccess(response.data.messages.reverse()),
      );
    }
  } catch (error) {
    yield put(getRoomMessagesFailure(returnErrorText(error)));
  } finally {
    yield put(hideLoading());
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
      yield put(fileUploadActionSuccess(response.data.newFile));
    }
  } catch (error) {
    yield put(fileUploadActionFailure(returnErrorText(error)));
  }
}

function* archiveRoom(action) {
  try {
    const selectProjectId = (state) =>
      state.projectReducer.projectDetails._id;
    const project = yield select(selectProjectId);
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.put(
        `rooms/${action.roomId}/archive?pid=${project}`,
        action.data,
        headers,
      );
      if (response.status === 200 || 201) {
        yield put(
          archiveRoomSuccess({
            roomId: action.roomId,
            archive: action.data.archive,
          }),
        );
      }
    }
  } catch (error) {
    yield put(archiveRoomFailure(returnErrorText(error)));
  }
}

function* getRoomSharedFiles({ roomId, limit, skip }) {
  try {
    yield put(showLoading());
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `messages/room/${roomId}/files?limit=${limit}&skip=${skip}`,
        headers,
      );
      yield put(getRoomSharedFilesSuccess(response.data.files));
    }
  } catch (error) {
    yield put(getRoomSharedFilesFailure(returnErrorText(error)));
  } finally {
    yield put(hideLoading());
  }
}

function* getRoomDiscussions({ roomId, limit, skip }) {
  try {
    yield put(showLoading());
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `messages/room/${roomId}/discussion?limit=${limit}&skip=${skip}`,
        headers,
      );
      yield put(getRoomDiscussionsSuccess(response.data.discussion));
    }
  } catch (error) {
    yield put(getRoomDiscussionsFailure(returnErrorText(error)));
  } finally {
    yield put(hideLoading());
  }
}

function* toggleDiscussions({ messageId, data }) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.put(
        `messages/${messageId}/discussion`,
        data,
        headers,
      );
      const responseData = {
        data: {
          _id: response.data.discussion._id,
          text: response.data.discussion.text,
          room: response.data.discussion.room,
          createdAt: response.data.discussion.createdAt,
          updatedAt: response.data.discussion.updatedAt,
        },
        discussion: response.data.discussion.discussion,
      };
      response.data.discussion.discussion
        ? yield put(toggleDiscussionRoomSuccess(responseData))
        : yield put(removeRoomDiscussion(responseData));
    }
  } catch (error) {
    yield put(toggleDiscussionRoomFailure(returnErrorText(error)));
  }
}

function* updateLastSeen({ roomId }) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.put(
        `rooms/last-seen/${roomId}`,
        null,
        headers,
      );
      if (response.status === 200) {
        yield put(updateLastSeenSuccess(roomId));
      }
    }
  } catch (error) {
    yield put(updateLastSeenFailure(returnErrorText(error)));
  }
}

function* fetchRooms() {
  try {
    const headers = tokenConfig();
    const projectId = yield select(getProjectId);
    if (projectId) {
      if ((headers as any).headers.Authorization) {
        const response = yield tigrowApi.get(
          `rooms/list?pid=${projectId}`,
          headers,
        );
        yield put(fetchRoomsSuccess(response.data));
        const unreadCount = yield response.data.rooms.map(
          (room: any) => response.data.roomsUnreadCount[room._id],
        );

        const totalUnread = yield unreadCount.reduce(
          (accumulator, current) => accumulator + current,
        );
        yield put({
          type: room.COUNT_TOTAL_REED_COUNT,
          payload: totalUnread,
        });
      }
    } else yield put(fetchRoomsFailure('No Project Id'));
  } catch (error) {
    yield put(fetchRoomsFailure(returnErrorText(error)));
  }
}

function* fetchChatsAsync() {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(`rooms/chats`, headers);
      yield put(fetchChatsSuccess(response.data.rooms));
    }
  } catch (error) {
    yield put(fetchChatsFailure(returnErrorText(error)));
  }
}

export function* onRoomCreate() {
  yield takeEvery(RoomActionTypes.CREATE_ROOM_START, createRoom);
}

export function* onGetRooms() {
  yield takeLatest(RoomActionTypes.GET_ROOMS_START, getRooms);
}

export function* onGetRoomMembers() {
  yield takeLatest(
    RoomActionTypes.GET_ROOM_MEMBERS_START,
    getRoomMembers,
  );
}

export function* onAddRoomMembers() {
  yield takeEvery(
    RoomActionTypes.ADD_ROOM_MEMBERS_START,
    addRoomMembers,
  );
}

export function* onSendRoomMessage() {
  yield takeEvery(
    RoomActionTypes.SEND_MESSAGE_START,
    sendRoomMessage,
  );
}

export function* onGetRoomMessages() {
  yield takeLatest(
    RoomActionTypes.GET_ROOM_MESSAGES_START,
    getRoomMessages,
  );
}

export function* onFileUpload() {
  yield takeEvery(
    RoomActionTypes.FILE_UPLOAD_START,
    fileUploadAction,
  );
}

export function* onArchiveRoom() {
  yield takeEvery(RoomActionTypes.ARCHIVE_ROOM_START, archiveRoom);
}

export function* onGetRoomSharedFiles() {
  yield takeLatest(
    RoomActionTypes.GET_ROOM_SHARED_FILES_START,
    getRoomSharedFiles,
  );
}

export function* onGetRoomDiscussions() {
  yield takeLatest(
    RoomActionTypes.GET_ROOM_DISCUSSIONS_START,
    getRoomDiscussions,
  );
}

export function* onToggleDiscussions() {
  yield takeLatest(
    RoomActionTypes.TOGGLE_ROOM_DISCUSSION_START,
    toggleDiscussions,
  );
}

export function* onUpdateLastSeen() {
  yield takeLatest(
    RoomActionTypes.UPDATE_LAST_SEEN_START,
    updateLastSeen,
  );
}

export function* onFetchRooms() {
  yield takeLatest(RoomActionTypes.FETCH_ROOMS_START, fetchRooms);
}

export function* onFetchChats() {
  yield takeLatest(
    RoomActionTypes.FETCH_CHATS_START,
    fetchChatsAsync,
  );
}

export default function* roomSaga() {
  yield all([
    call(onRoomCreate),
    call(onGetRooms),
    call(onGetRoomMembers),
    call(onAddRoomMembers),
    call(onSendRoomMessage),
    call(onGetRoomMessages),
    call(onToggleDiscussions),
    call(onFileUpload),
    call(onArchiveRoom),
    call(onGetRoomSharedFiles),
    call(onGetRoomDiscussions),
    call(onUpdateLastSeen),
    call(onFetchRooms),
    call(onFetchChats),
  ]);
}
