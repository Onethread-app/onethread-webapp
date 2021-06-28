import { all, call, put, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import {
  room,
  LOADING_ROOM,
  ALL_MESSAGE_RECEIVED,
  RoomActionTypes,
  CURRENT_ROOM,
} from './Types';
import { tigrowApi } from 'config';
import { tokenConfig } from 'stores/UtilsActions';
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
  toggleDiscussionRoomFailure,
  toggleDiscussionRoomSuccess,
  updateLastSeenFailure,
  updateLastSeenSuccess,
} from './Actions';
import handleError from 'helpers/HandleSagaErrors';
import { getProjectId } from 'stores/project/Selector';

const takeEvery: any = Eff.takeEvery; // <-- new
const takeLatest: any = Eff.takeLatest;

function* createRoom({ payload }) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      // const company = yield select(getCompanyId);
      const project = yield select(getProjectId);
      yield put({ type: LOADING_ROOM });
      const response = yield tigrowApi.post(
        `rooms?pid=${project}`,
        {
          ...payload,
        },
        headers,
      );
      yield all([
        put(createRoomSuccess(response.data.room)),
        put({
          type: room.RESPONSE_STATUS_CODE,
          payload: response.status,
        }),
        put({ type: CURRENT_ROOM, payload: response.data.room }),
      ]);
      yield roomSubscribe(response.data.room._id);
    }
  } catch (error) {
    yield put({
      type: room.RESPONSE_STATUS_CODE,
      payload: error.response.status,
    });
    handleError(error, async (errorMessage: any) => {
      await createRoomFailure(errorMessage);
    });
  }
}

function* getRooms() {
  try {
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
    handleError(error, async (errorMessage: any) => {
      await getRoomsFailure(errorMessage);
    });
  }
}

function* getRoomMembers({ payload }) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `rooms/members/${payload}`,
        headers,
      );
      yield put(getRoomMembersSuccess(response.data.members));
    }
  } catch (error) {
    handleError(error, async (errorMessage: any) => {
      await getRoomMembersFailure(errorMessage);
    });
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
  } catch (error) {
    handleError(error, async (errorMessage: any) => {
      await addRoomMembersFailure(errorMessage);
    });
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
    handleError(error, async (errorMessage: any) => {
      await sendRoomMessageFailure(errorMessage);
    });
  }
}

function* getRoomMessages({ roomId, limit, skip }) {
  try {
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
    handleError(error, async (errorMessage: any) => {
      await getRoomMessagesFailure(errorMessage);
    });
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
    handleError(error, async (errorMessage: any) => {
      await fileUploadActionFailure(errorMessage);
    });
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
    handleError(error, async (errorMessage: any) => {
      await archiveRoomFailure(errorMessage);
    });
  }
}

function* getRoomSharedFiles({ roomId, limit, skip }) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `messages/room/${roomId}/files?limit=${limit}&skip=${skip}`,
        headers,
      );
      yield put(getRoomSharedFilesSuccess(response.data.files));
    }
  } catch (error) {
    handleError(error, async (errorMessage: any) => {
      await getRoomSharedFilesFailure(errorMessage);
    });
  }
}

function* getRoomDiscussions({ roomId, limit, skip }) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `messages/room/${roomId}/discussion?limit=${limit}&skip=${skip}`,
        headers,
      );
      yield put(getRoomDiscussionsSuccess(response.data.discussion));
    }
  } catch (error) {
    handleError(error, async (errorMessage: any) => {
      await getRoomDiscussionsFailure(errorMessage);
    });
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
    handleError(error, async (errorMessage: any) => {
      await toggleDiscussionRoomFailure(errorMessage);
    });
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
    handleError(error, async (errorMessage: any) => {
      await updateLastSeenFailure(errorMessage);
    });
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
    handleError(error, async (errorMessage: any) => {
      await fetchRoomsFailure(errorMessage);
    });
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
    handleError(error, async (errorMessage: any) => {
      await fetchChatsFailure(errorMessage);
    });
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
