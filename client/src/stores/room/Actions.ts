import { CLEAR_ROOMS_ERROR, RoomActionTypes } from './Types';

export const createRoom = (roomData: any) => ({
  type: RoomActionTypes.CREATE_ROOM_START,
  payload: roomData,
});

export const createRoomSuccess = (response: any) => ({
  type: RoomActionTypes.CREATE_ROOM_SUCCESS,
  payload: response,
});

export const createRoomFailure = (errorMessage: any) => ({
  type: RoomActionTypes.CREATE_ROOM_FAILURE,
  payload: errorMessage,
});

export const getRooms = () => ({
  type: RoomActionTypes.GET_ROOMS_START,
});

export const getRoomsSuccess = (response: any) => ({
  type: RoomActionTypes.GET_ROOMS_SUCCESS,
  payload: response,
});

export const getRoomsFailure = (errorMessage: any) => ({
  type: RoomActionTypes.GET_ROOMS_FAILURE,
  payload: errorMessage,
});

export const getRoomMembers = (roomId: string) => ({
  type: RoomActionTypes.GET_ROOM_MEMBERS_START,
  payload: roomId,
});

export const getRoomMembersSuccess = (response: any) => ({
  type: RoomActionTypes.GET_ROOM_MEMBERS_SUCCESS,
  payload: response,
});

export const getRoomMembersFailure = (errorMessage: any) => ({
  type: RoomActionTypes.GET_ROOM_MEMBERS_FAILURE,
  payload: errorMessage,
});

export const addRoomMembers = (
  data: {
    room: string;
    company: string;
    project: string;
    members: Array<{
      account: any;
      team: any;
    }>;
  },
  selectedRoomMember: any,
) => ({
  type: RoomActionTypes.ADD_ROOM_MEMBERS_START,
  data,
  selectedRoomMember,
});

export const addRoomMembersSuccess = (response: any) => ({
  type: RoomActionTypes.ADD_ROOM_MEMBERS_SUCCESS,
  payload: response,
});

export const addRoomMembersFailure = (errorMessage: any) => ({
  type: RoomActionTypes.ADD_ROOM_MEMBERS_FAILURE,
  payload: errorMessage,
});

export const clearRoomError = () => ({
  type: CLEAR_ROOMS_ERROR,
});

export const sendRoomMessage = (data: {
  text: string;
  room: string;
  files: any[];
  type?: string;
}) => ({
  type: RoomActionTypes.SEND_MESSAGE_START,
  payload: data,
});

export const sendRoomMessageSuccess = () => ({
  type: RoomActionTypes.SEND_MESSAGE_SUCCESS,
});

export const sendRoomMessageFailure = (errorMessage: any) => ({
  type: RoomActionTypes.SEND_MESSAGE_FAILURE,
  payload: errorMessage,
});

export const getRoomMessages = (
  roomId: string,
  limit: number = 15,
  skip: number = 0,
) => ({
  type: RoomActionTypes.GET_ROOM_MESSAGES_START,
  roomId,
  limit,
  skip,
});

export const getRoomMessagesSuccess = (response: any) => ({
  type: RoomActionTypes.GET_ROOM_MESSAGES_SUCCESS,
  payload: response,
});

export const getRoomMessagesFailure = (errorMessage: any) => ({
  type: RoomActionTypes.GET_ROOM_MESSAGES_FAILURE,
  payload: errorMessage,
});

export const fileUploadAction = (
  imageSelected: any,
  roomID: string,
) => ({
  type: RoomActionTypes.FILE_UPLOAD_START,
  imageSelected,
  roomID,
});

export const fileUploadActionSuccess = (response: any) => ({
  type: RoomActionTypes.FILE_UPLOAD_SUCCESS,
  payload: response,
});

export const fileUploadActionFailure = (errorMessage: any) => ({
  type: RoomActionTypes.FILE_UPLOAD_FAILURE,
  payload: errorMessage,
});

export const archiveRoom = (
  data: { archive: boolean },
  roomId: string,
) => ({
  type: RoomActionTypes.ARCHIVE_ROOM_START,
  data,
  roomId,
});

export const archiveRoomSuccess = (response: any) => ({
  type: RoomActionTypes.ARCHIVE_ROOM_SUCCESS,
  payload: response,
});

export const archiveRoomFailure = (errorMessage: any) => ({
  type: RoomActionTypes.ARCHIVE_ROOM_FAILURE,
  payload: errorMessage,
});

export const getRoomSharedFiles = (
  roomId: string,
  limit: number = 1000,
  skip: number = 0,
) => ({
  type: RoomActionTypes.GET_ROOM_SHARED_FILES_START,
  roomId,
  limit,
  skip,
});

export const getRoomSharedFilesSuccess = (response: any) => ({
  type: RoomActionTypes.GET_ROOM_SHARED_FILES_SUCCESS,
  payload: response,
});

export const getRoomSharedFilesFailure = (errorMessage: any) => ({
  type: RoomActionTypes.GET_ROOM_SHARED_FILES_FAILURE,
  payload: errorMessage,
});

export const getRoomDiscussions = (
  roomId: string,
  limit: number = 1000,
  skip: number = 0,
) => ({
  type: RoomActionTypes.GET_ROOM_DISCUSSIONS_START,
  roomId,
  limit,
  skip,
});

export const getRoomDiscussionsSuccess = (response: any) => ({
  type: RoomActionTypes.GET_ROOM_DISCUSSIONS_SUCCESS,
  payload: response,
});

export const getRoomDiscussionsFailure = (errorMessage: any) => ({
  type: RoomActionTypes.GET_ROOM_DISCUSSIONS_FAILURE,
  payload: errorMessage,
});

export const toggleDiscussionRoom = (
  data: { discussion: boolean },
  messageId: string,
) => ({
  type: RoomActionTypes.TOGGLE_ROOM_DISCUSSION_START,
  data,
  messageId,
});

export const toggleDiscussionRoomSuccess = (response: any) => ({
  type: RoomActionTypes.TOGGLE_ROOM_DISCUSSION_SUCCESS,
  payload: response,
});

export const toggleDiscussionRoomFailure = (errorMessage: any) => ({
  type: RoomActionTypes.TOGGLE_ROOM_DISCUSSION_FAILURE,
  payload: errorMessage,
});

export const removeRoomDiscussion = (response: any) => ({
  type: RoomActionTypes.REMOVE_ROOM_DISCUSSION,
  payload: response,
});

export const updateLastSeen = (roomId: string) => ({
  type: RoomActionTypes.UPDATE_LAST_SEEN_START,
  roomId,
});

export const updateLastSeenSuccess = (response: any) => ({
  type: RoomActionTypes.UPDATE_LAST_SEEN_SUCCESS,
  payload: response,
});

export const updateLastSeenFailure = (errorMessage: any) => ({
  type: RoomActionTypes.UPDATE_LAST_SEEN_FAILURE,
  payload: errorMessage,
});

export const fetchRooms = () => ({
  type: RoomActionTypes.FETCH_ROOMS_START,
});

export const fetchRoomsSuccess = (response: any) => ({
  type: RoomActionTypes.FETCH_ROOMS_SUCCESS,
  payload: response,
});

export const fetchRoomsFailure = (errorMessage: any) => ({
  type: RoomActionTypes.FETCH_ROOMS_FAILURE,
  payload: errorMessage,
});

export const fetchChats = () => ({
  type: RoomActionTypes.FETCH_CHATS_START,
});

export const fetchChatsSuccess = (response: any) => ({
  type: RoomActionTypes.FETCH_CHATS_SUCCESS,
  payload: response,
});

export const fetchChatsFailure = (errorMessage: any) => ({
  type: RoomActionTypes.FETCH_ROOMS_FAILURE,
  payload: errorMessage,
});

export const setRoomLoading = (value: boolean) => ({
  type: RoomActionTypes.SET_ROOM_LOADING,
  payload: value,
});
