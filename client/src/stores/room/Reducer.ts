import {
  LOADING_ROOM,
  GET_ROOM_MESSAGES,
  GET_ROOMS,
  CHANGE_ROOM,
  CURRENT_ROOM,
  NEW_MESSAGE,
  CLEAR_ROOMS_REDUCER_STATE,
  CREATE_ROOM_FROM_SERVER_SUCCESS,
  GET_ROOM_ERROR,
  GET_ROOM_MEMBERS,
  GET_ROOM_MEMBERS_ERROR,
  ADD_MEMBER_IN_ROOM_ERROR,
  ADD_MEMBER_IN_ROOM,
  ACTIVE_ROOM,
  UPDATE_ROOM,
  ON_USER_STARTED_TYPING,
  ON_USER_STOPPED_TYPING,
  CLEAR_ROOMS_ERROR,
  TOGGLE_EMOJI_PICKER,
  FILE_UPLOAD,
  CLEAR_FILE_UPLOAD,
  DELETE_ONE_PENDING_FILE,
  ALL_MESSAGE_RECEIVED,
  ARCHIVE_ROOM,
  GET_ROOM_SHARED_FILES_ERROR,
  GET_ROOM_SHARED_FILES,
  GET_ROOM_DISCUSSIONS,
  GET_ROOM_DISCUSSIONS_ERROR,
  SET_ROOM_DISCUSSIONS,
  TOGGLE_ROOM_DISCUSSIONS_ERROR,
  REMOVE_ROOM_DISCUSSIONS,
  GET_COMPANY_ROOMS,
  CLEAR_ROOMS_REDUCER_STATE_FOR_CHANGE_PROJECT,
  CLEAR_ROOMS_REDUCER_STATE_FOR_CHANGE_COMPANY,
  UPDATE_UNREAD_COUNT_ROOMS,
  CLEAR_UNREAD_COUNT_FOR_SINGLE_ROOM,
  INCREMENT_UNREAD_COUNT_FOR_SINGLE_ROOM,
  room,
} from './Types';

export interface IRoom {
  _id: string;
  name: string;
  company: string;
  project: string;
  account: string;
  createdAt: string;
  updatedAt: string;
  archive: boolean;
  removed: boolean;
}

export interface IRoomMember {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  profileImage?: string;
}

export interface IRoomPendingFile {
  _id: string;
  link: string;
  s3Key: string;
  type: string;
  account: string;
  room: string;
  createdAt: string;
  updatedAt: string;
}

export interface IRoomFile {
  _id: string;
  link: string;
  s3Key: string;
}

export interface IRoomMessage {
  type: string;
  files: IRoomFile[];
  discussion: boolean;
  removed: boolean;
  _id: string;
  text: string;
  room: string;
  account: IRoomMember;
  createdAt: string;
  updatedAt: string;
}

export interface IRoomDiscussion {
  _id: string;
  text: string;
  room: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICompanyRoom {
  _id: string;
  name: string;
  company: string;
  project: string;
  unreadCount: number;
}

export interface ITypingUsers {
  _id: string;
  name: string;
  roomId: string;
}

export interface IRoomReducer {
  activeRoom: {};
  currentRoom: IRoom;
  allMessages: boolean;
  messages: IRoomMessage[];
  typing: {
    users: ITypingUsers[];
  };
  users: IRoomMember[];
  discussions: IRoomDiscussion[];
  sharedFileMessages: IRoomMessage[];
  rooms: IRoom[];
  roomsUnreadCount: any;
  loading: boolean;
  emojiPicker: boolean;
  pendingFiles: IRoomPendingFile[];
  companyRooms: ICompanyRoom[];
  roomError: string;
  responseCode: number;
  roomNotification: {};
  totalUnread: number;
}
const InitialState: IRoomReducer = {
  activeRoom: {},
  currentRoom: {
    _id: '',
    name: '',
    account: '',
    company: '',
    project: '',
    archive: false,
    removed: false,
    createdAt: '',
    updatedAt: '',
  },
  allMessages: false,
  messages: [],
  typing: {
    users: [],
  },
  users: [],
  discussions: [],
  sharedFileMessages: [],
  rooms: [],
  roomsUnreadCount: {},
  emojiPicker: false,
  pendingFiles: [],
  companyRooms: [],
  loading: false,
  roomError: '',
  responseCode: 0,
  roomNotification: {},
  totalUnread: 0,
};

export const sortRooms = (a: IRoom, b: IRoom) => {
  // tslint:disable-next-line: one-variable-per-declaration
  // const unreadCountA = a.unreadCount;
  // const unreadCountB = b.unreadCount;
  const createdAtA = Date.parse(a.createdAt);
  const createdAtB = Date.parse(b.createdAt);

  // return unreadCountA > unreadCountB ?
  // 	-1 : unreadCountA < unreadCountB ?
  // 		1 : createdAtA > createdAtB ?
  // 			1 : createdAtA < createdAtB ?
  // 				-1 : 0;
  return createdAtA > createdAtB
    ? 1
    : createdAtA < createdAtB
    ? -1
    : 0;
};

const clearUnreadCountForSingleRoom = (
  roomsUnreadCount: any,
  roomId: any,
) => {
  roomsUnreadCount[roomId] = 0;
  return roomsUnreadCount;
};
const incrementUnreadCountForSingleRoom = (
  roomsUnreadCount: any,
  roomId: any,
) => {
  roomsUnreadCount[roomId] = roomsUnreadCount[roomId] + 1;
  return roomsUnreadCount;
};

const updateUnreadCount = (
  roomsUnreadCount: any,
  updatedRoom: any,
) => {
  roomsUnreadCount[updatedRoom._id] = updatedRoom.unreadCount;
  return roomsUnreadCount;
};

const updateCompanyRooms = (
  companyRooms: ICompanyRoom[],
  updatedRoom: any,
) => {
  return companyRooms.map((room: ICompanyRoom) => {
    if (room._id === updatedRoom.id) {
      return {
        _id: room._id,
        name: room.name,
        company: room.company,
        project: room.project,
        unreadCount: updatedRoom.unreadCount,
      };
    }
    return room;
  });
};

const onUserStartedTyping = (state: IRoomReducer, action: any) => {
  return {
    ...state,
    typing: {
      users: [...state.typing.users, action.payload],
    },
    loading: false,
  };
};

export const RoomReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case LOADING_ROOM:
      return {
        ...state,
        loading: true,
        roomError: '',
      };
    case FILE_UPLOAD: {
      return {
        ...state,
        pendingFiles: [...state.pendingFiles, action.payload],
      };
    }
    case GET_COMPANY_ROOMS: {
      return {
        ...state,
        companyRooms: action.payload,
      };
    }
    case UPDATE_UNREAD_COUNT_ROOMS: {
      return {
        ...state,
        roomsUnreadCount: updateUnreadCount(
          state.roomsUnreadCount,
          action.payload,
        ),
      };
    }
    case CLEAR_UNREAD_COUNT_FOR_SINGLE_ROOM: {
      return {
        ...state,
        roomsUnreadCount: clearUnreadCountForSingleRoom(
          state.roomsUnreadCount,
          action.payload,
        ),
      };
    }
    case INCREMENT_UNREAD_COUNT_FOR_SINGLE_ROOM: {
      return {
        ...state,
        roomsUnreadCount: incrementUnreadCountForSingleRoom(
          state.roomsUnreadCount,
          action.payload,
        ),
      };
    }
    case DELETE_ONE_PENDING_FILE: {
      return {
        ...state,
        pendingFiles: state.pendingFiles.filter(
          (file: IRoomPendingFile) => {
            return file._id !== action.payload;
          },
        ),
      };
    }
    case CLEAR_FILE_UPLOAD: {
      return {
        ...state,
        pendingFiles: [],
      };
    }
    case ON_USER_STARTED_TYPING:
      return onUserStartedTyping(state, action);
    case ON_USER_STOPPED_TYPING:
      return {
        ...state,
        typing: {
          ...state.typing,
          users: state.typing.users.filter((user: any) => {
            return user._id !== action.payload._id;
          }),
        },
        loading: false,
      };
    case GET_ROOM_MEMBERS:
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    case ADD_MEMBER_IN_ROOM:
      return {
        ...state,
        users: [...state.users, ...action.payload],
        loading: false,
      };
    case ACTIVE_ROOM:
      return {
        ...state,
        activeRoom: action.payload,
        loading: false,
      };
    case CURRENT_ROOM:
      return {
        ...state,
        currentRoom: action.payload,
        loading: false,
      };
    case NEW_MESSAGE:
      return {
        ...state,
        messages:
          action.payload.room === state.currentRoom._id
            ? state.messages.length === 0 ||
              (state.messages[
                state.messages.length - 1
              ] as IRoomMessage)._id !== action.payload._id
              ? [...state.messages, action.payload]
              : [...state.messages]
            : [...state.messages],
        sharedFileMessages:
          action.payload.room === state.currentRoom._id
            ? state.messages.length === 0 ||
              (state.messages[
                state.messages.length - 1
              ] as IRoomMessage)._id !== action.payload._id
              ? [...state.sharedFileMessages, action.payload]
              : [...state.sharedFileMessages]
            : [...state.sharedFileMessages],
        loading: false,
      };
    case GET_ROOM_MESSAGES:
      return {
        ...state,
        messages: [...action.payload, ...state.messages],
        loading: false,
      };
    case ALL_MESSAGE_RECEIVED:
      return {
        ...state,
        allMessages: action.payload,
      };
    case CHANGE_ROOM:
      return {
        ...state,
        messages: [],
        discussions: [],
        sharedFileMessages: [],
        loading: false,
      };
    case UPDATE_ROOM:
      return {
        ...state,
        // rooms: state.rooms
        // 	.map((room: IRoom) => {
        // 		if (room.id === action.payload.id) {
        // 			return {
        // 				id: action.payload.id,
        // 				name: action.payload.name,
        // 				unreadCount: action.payload.unreadCount,
        // 				company: action.payload.customData.company,
        // 				account: action.payload.createdByUserId,
        // 				createdAt: action.payload.createdAt,
        // 				updatedAt: action.payload.updatedAt,
        // 			};
        // 		} else {
        // 			return room;
        // 		}
        // 	}).sort(sortRooms),
        roomsUnreadCount: updateUnreadCount(
          state.roomsUnreadCount,
          action.payload,
        ),
        companyRooms: updateCompanyRooms(
          state.companyRooms,
          action.payload,
        ),
        loading: false,
      };
    case ARCHIVE_ROOM:
      return {
        ...state,
        currentRoom: {
          ...state.currentRoom,
          archive: action.payload.archive,
        },
        rooms: state.rooms.map((room: IRoom) => {
          if (room._id === action.payload.roomId) {
            return {
              ...room,
              archive: action.payload.archive,
            };
          } else {
            return room;
          }
        }),
        loading: false,
      };
    case GET_ROOMS:
      return {
        ...state,
        rooms: action.payload.rooms.sort(sortRooms),
        roomsUnreadCount: action.payload.roomsUnreadCount,
        loading: false,
      };
    case room.FETCH_ROOMS_SUCCESS:
      return {
        ...state,
        roomNotification: action.payload,
      };
    case CREATE_ROOM_FROM_SERVER_SUCCESS:
      return {
        ...state,
        responseCode: 0,
        rooms: [
          ...state.rooms,
          {
            _id: action.payload._id,
            name: action.payload.name,
            company: action.payload.company,
            project: action.payload.project,
            account: action.payload.account,
            createdAt: action.payload.createdAt,
            updatedAt: action.payload.updatedAt,
            archive: action.payload.archive,
            removed: action.payload.removed,
          },
        ],
        roomError: '',
        loading: false,
      };

    case room.RESPONSE_STATUS_CODE:
      return {
        ...state,
        responseCode: action.payload,
      };

    case room.CLEAR_STATUS_CODE:
      return {
        ...state,
        responseCode: 0,
      };

    case TOGGLE_EMOJI_PICKER:
      return {
        ...state,
        emojiPicker: action.payload,
      };
    case GET_ROOM_SHARED_FILES:
      return {
        ...state,
        sharedFileMessages: [
          ...state.sharedFileMessages,
          ...action.payload,
        ],
        loading: false,
      };
    case GET_ROOM_DISCUSSIONS:
      return {
        ...state,
        discussions: [...state.discussions, ...action.payload],
        loading: false,
      };
    case SET_ROOM_DISCUSSIONS:
      return {
        ...state,
        messages: state.messages.map((message: IRoomMessage) => {
          if (message._id === action.payload.data._id) {
            return {
              ...message,
              discussion: action.payload.discussion,
            };
          } else {
            return message;
          }
        }),
        discussions: [...state.discussions, action.payload.data],
        loading: false,
      };
    case REMOVE_ROOM_DISCUSSIONS:
      return {
        ...state,
        messages: state.messages.map((message: IRoomMessage) => {
          if (message._id === action.payload.data._id) {
            return {
              ...message,
              discussion: action.payload.discussion,
            };
          } else {
            return message;
          }
        }),
        discussions: state.discussions.filter(
          (discussion: IRoomDiscussion) => {
            return discussion._id !== action.payload.data._id;
          },
        ),
        loading: false,
      };
    case TOGGLE_ROOM_DISCUSSIONS_ERROR:
    case GET_ROOM_DISCUSSIONS_ERROR:
    case GET_ROOM_SHARED_FILES_ERROR:
    case ADD_MEMBER_IN_ROOM_ERROR:
    case GET_ROOM_MEMBERS_ERROR:
    case room.CREATE_ROOM_ERROR:
    case GET_ROOM_ERROR:
      return {
        ...state,
        roomError: action.payload,
        loading: false,
      };
    case CLEAR_ROOMS_ERROR:
      return {
        ...state,
        roomError: '',
      };
    case CLEAR_ROOMS_REDUCER_STATE:
      return {
        ...InitialState,
      };
    case CLEAR_ROOMS_REDUCER_STATE_FOR_CHANGE_COMPANY:
    case CLEAR_ROOMS_REDUCER_STATE_FOR_CHANGE_PROJECT:
      return {
        ...InitialState,
        companyRooms: state.companyRooms,
      };
    case room.COUNT_TOTAL_REED_COUNT:
      return {
        ...state,
        totalUnread: action.payload,
      };
    default:
      return state;
  }
};
