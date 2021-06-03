import {
  LOADING_ROOM,
  // GET_ROOM_MESSAGES,
  // GET_ROOMS,
  CHANGE_ROOM,
  CURRENT_ROOM,
  NEW_MESSAGE,
  CLEAR_ROOMS_REDUCER_STATE,
  // CREATE_ROOM_FROM_SERVER_SUCCESS,
  // GET_ROOM_ERROR,
  // GET_ROOM_MEMBERS,
  // GET_ROOM_MEMBERS_ERROR,
  // ADD_MEMBER_IN_ROOM_ERROR,
  // ADD_MEMBER_IN_ROOM,
  // ACTIVE_ROOM,
  UPDATE_ROOM,
  ON_USER_STARTED_TYPING,
  ON_USER_STOPPED_TYPING,
  CLEAR_ROOMS_ERROR,
  TOGGLE_EMOJI_PICKER,
  // FILE_UPLOAD,
  CLEAR_FILE_UPLOAD,
  DELETE_ONE_PENDING_FILE,
  ALL_MESSAGE_RECEIVED,
  // ARCHIVE_ROOM,
  // GET_ROOM_SHARED_FILES_ERROR,
  // GET_ROOM_SHARED_FILES,
  // GET_ROOM_DISCUSSIONS,
  // GET_ROOM_DISCUSSIONS_ERROR,
  // SET_ROOM_DISCUSSIONS,
  // TOGGLE_ROOM_DISCUSSIONS_ERROR,
  // REMOVE_ROOM_DISCUSSIONS,
  GET_COMPANY_ROOMS,
  CLEAR_ROOMS_REDUCER_STATE_FOR_CHANGE_PROJECT,
  CLEAR_ROOMS_REDUCER_STATE_FOR_CHANGE_COMPANY,
  // UPDATE_UNREAD_COUNT_ROOMS,
  // CLEAR_UNREAD_COUNT_FOR_SINGLE_ROOM,
  INCREMENT_UNREAD_COUNT_FOR_SINGLE_ROOM,
  room,
  RoomActionTypes,
} from './Types';

export interface IRoom {
  _id: string;
  name: string;
  company: {
    _id: string;
    uniqueName: string;
  };
  project: string;
  account: string;
  createdAt: string;
  updatedAt: string;
  archive: boolean;
  removed: boolean;
}

export interface IChat {
  _id: string;
  read: boolean;
  seen: boolean;
  receiver: string;
  message: {
    _id: string;
    type: string;
    text: string;
    createdAt: string;
    account: {
      _id: string;
      firstName: string;
      lastName: string;
      profileImage: string;
    };
  };
  room: {
    _id: string;
    name: string;
    company: {
      _id: string;
      uniqueName: string;
    };
    project: {
      _id: string;
      name: string;
      color: number;
    };
  };
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
  chats: IChat[];
  roomsUnreadCount: any;
  loading: boolean;
  emojiPicker: boolean;
  pendingFiles: IRoomPendingFile[];
  companyRooms: ICompanyRoom[];
  roomError: string;
  responseCode: number;
  roomNotification: {};
  totalUnread: number;
  creatingRoom: boolean;
  gettingRoom: boolean;
  gettingRoomMembers: boolean;
  addingRoomMembers: boolean;
  sendingMessage: boolean;
  loadingMessages: boolean;
  uploadingFile: boolean;
  archivingRoom: boolean;
  gettingFiles: boolean;
  gettingDiscussions: boolean;
  togglingDiscussion: boolean;
  updatingLastSeen: boolean;
  fetchingRooms: boolean;
  fetchingChats: boolean;
  errorOnRoomCreate: string;
  errorOnGettingRoom: string;
  errorOnGettingRoomMembers: string;
  errorOnAddingMembers: string;
  errorOnSendingMessage: string;
  errorOnLoadingMessages: string;
  errorOnFileUpload: string;
  errorOnArchive: string;
  errorOnGettingFiles: string;
  errorOnGettingDiscussions: string;
  errorOnToggleDiscussion: string;
  errorOnUpdatingLastSeen: string;
  errorOnFetchingRoom: string;
  errorOnFetchingChats: string;
}
const InitialState: IRoomReducer = {
  activeRoom: {},
  currentRoom: {
    _id: '',
    name: '',
    account: '',
    company: {
      _id: '',
      uniqueName: '',
    },
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
  chats: [],
  roomsUnreadCount: {},
  emojiPicker: false,
  pendingFiles: [],
  companyRooms: [],
  loading: false,
  roomError: '',
  responseCode: 0,
  roomNotification: {},
  totalUnread: 0,
  creatingRoom: false,
  gettingRoom: false,
  gettingRoomMembers: false,
  addingRoomMembers: false,
  sendingMessage: false,
  loadingMessages: false,
  uploadingFile: false,
  archivingRoom: false,
  gettingFiles: false,
  gettingDiscussions: false,
  togglingDiscussion: false,
  updatingLastSeen: false,
  fetchingRooms: false,
  fetchingChats: false,
  errorOnRoomCreate: '',
  errorOnGettingRoom: '',
  errorOnGettingRoomMembers: '',
  errorOnAddingMembers: '',
  errorOnSendingMessage: '',
  errorOnLoadingMessages: '',
  errorOnFileUpload: '',
  errorOnArchive: '',
  errorOnGettingFiles: '',
  errorOnGettingDiscussions: '',
  errorOnToggleDiscussion: '',
  errorOnUpdatingLastSeen: '',
  errorOnFetchingRoom: '',
  errorOnFetchingChats: '',
};

export const sortRooms = (a: IRoom, b: IRoom) => {
  const createdAtA = Date.parse(a.createdAt);
  const createdAtB = Date.parse(b.createdAt);
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
    case RoomActionTypes.FILE_UPLOAD_START:
      return {
        ...state,
        uploadingFile: true,
      };
    case RoomActionTypes.FILE_UPLOAD_SUCCESS:
      return {
        ...state,
        pendingFiles: [...state.pendingFiles, action.payload],
        uploadingFile: false,
      };
    case RoomActionTypes.FILE_UPLOAD_FAILURE:
      return {
        ...state,
        errorOnFileUpload: action.payload,
        uploadingFiles: false,
      };
    case RoomActionTypes.UPDATE_LAST_SEEN_START:
      return {
        ...state,
        updatingLastSeen: true,
      };
    case RoomActionTypes.UPDATE_LAST_SEEN_SUCCESS: {
      return {
        ...state,
        roomsUnreadCount: clearUnreadCountForSingleRoom(
          state.roomsUnreadCount,
          action.payload,
        ),
        updatingLastSeen: false,
      };
    }
    case RoomActionTypes.UPDATE_LAST_SEEN_FAILURE:
      return {
        ...state,
        errorOnUpdatingLastSeen: action.payload,
        updatingLastSeen: false,
      };
    case RoomActionTypes.SEND_MESSAGE_START:
      return {
        ...state,
        sendingMessage: true,
      };
    case RoomActionTypes.SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        sendingMessage: false,
      };
    case RoomActionTypes.SEND_MESSAGE_FAILURE:
      return {
        ...state,
        errorOnSendingMessage: action.payload,
        sendingMessage: false,
      };
    case RoomActionTypes.GET_ROOM_MEMBERS_START:
      return {
        ...state,
        gettingRoomMembers: true,
      };
    case RoomActionTypes.GET_ROOM_MEMBERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
        gettingRoomMembers: false,
      };
    case RoomActionTypes.GET_ROOM_MEMBERS_FAILURE:
      return {
        ...state,
        errorOnGettingRoomMembers: action.payload,
      };
    case RoomActionTypes.ADD_ROOM_MEMBERS_START:
      return {
        ...state,
        addingRoomMembers: true,
      };
    case RoomActionTypes.ADD_ROOM_MEMBERS_SUCCESS:
      return {
        ...state,
        users: [...state.users, ...action.payload],
        addingRoomMembers: false,
      };
    case RoomActionTypes.ADD_ROOM_MEMBERS_FAILURE:
      return {
        ...state,
        errorOnAddingMembers: action.payload,
        addingRoomMembers: false,
      };
    case RoomActionTypes.GET_ROOM_MESSAGES_START:
      return {
        ...state,
        loadingMessages: true,
      };
    case RoomActionTypes.GET_ROOM_MESSAGES_SUCCESS:
      return {
        ...state,
        messages: [...action.payload, ...state.messages],
        loadingMessages: false,
      };
    case RoomActionTypes.GET_ROOM_MESSAGES_FAILURE:
      return {
        ...state,
        errorOnLoadingMessages: action.payload,
        loadingMessages: false,
      };
    case RoomActionTypes.ARCHIVE_ROOM_START:
      return {
        ...state,
        archivingRoom: true,
      };
    case RoomActionTypes.ARCHIVE_ROOM_SUCCESS:
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
        archivingRoom: false,
      };
    case RoomActionTypes.ARCHIVE_ROOM_FAILURE:
      return {
        ...state,
        errorOnArchive: action.payload,
        archivingRoom: false,
      };
    case RoomActionTypes.GET_ROOMS_START:
      return {
        ...state,
        gettingRoom: true,
      };
    case RoomActionTypes.GET_ROOMS_SUCCESS:
      return {
        ...state,
        rooms: action.payload.rooms.sort(sortRooms),
        roomsUnreadCount: action.payload.roomsUnreadCount,
        gettingRoom: false,
      };
    case RoomActionTypes.GET_ROOMS_FAILURE:
      return {
        ...state,
        gettingRoom: false,
        errorOnGettingRoom: action.payload,
      };
    case RoomActionTypes.FETCH_ROOMS_START:
      return {
        ...state,
        fetchingRooms: true,
      };
    case RoomActionTypes.FETCH_ROOMS_SUCCESS:
      return {
        ...state,
        roomNotification: action.payload,
        fetchingRooms: false,
      };
    case RoomActionTypes.FETCH_ROOMS_FAILURE:
      return {
        ...state,
        errorOnFetchingRoom: action.payload,
        fetchingRooms: false,
      };
    case RoomActionTypes.FETCH_CHATS_START:
      return {
        ...state,
        fetchingChats: true,
        errorOnFetchingChats: '',
      };
    case RoomActionTypes.FETCH_CHATS_SUCCESS:
      return {
        ...state,
        chats: action.payload,
        fetchingChats: false,
      };
    case RoomActionTypes.FETCH_CHATS_FAILURE:
      return {
        ...state,
        errorOnFetchingChats: action.payload,
      };
    case RoomActionTypes.CREATE_ROOM_START:
      return {
        ...state,
        creatingRoom: true,
      };
    case RoomActionTypes.CREATE_ROOM_SUCCESS:
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
        errorOnRoomCreate: '',
        creatingRoom: false,
      };
    case RoomActionTypes.GET_ROOM_SHARED_FILES_START:
      return {
        ...state,
        gettingFiles: true,
      };
    case RoomActionTypes.GET_ROOM_SHARED_FILES_SUCCESS:
      return {
        ...state,
        sharedFileMessages: [
          ...state.sharedFileMessages,
          ...action.payload,
        ],
        gettingFiles: false,
      };
    case RoomActionTypes.GET_ROOM_SHARED_FILES_FAILURE:
      return {
        ...state,
        errorOnGettingFiles: action.payload,
        gettingFiles: false,
      };
    case RoomActionTypes.GET_ROOM_DISCUSSIONS_START:
      return {
        ...state,
        gettingDiscussions: true,
      };
    case RoomActionTypes.GET_ROOM_DISCUSSIONS_SUCCESS:
      return {
        ...state,
        discussions: [...state.discussions, ...action.payload],
        gettingDiscussions: false,
      };
    case RoomActionTypes.GET_ROOM_DISCUSSIONS_FAILURE:
      return {
        ...state,
        errorOnGettingDiscussions: action.payload,
        gettingDiscussions: false,
      };
    case RoomActionTypes.TOGGLE_ROOM_DISCUSSION_START:
      return {
        ...state,
        togglingDiscussion: true,
      };
    case RoomActionTypes.TOGGLE_ROOM_DISCUSSION_SUCCESS:
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
        togglingDiscussion: false,
      };
    case RoomActionTypes.TOGGLE_ROOM_DISCUSSION_FAILURE:
      return {
        ...state,
        errorOnToggleDiscussion: action.payload,
        togglingDiscussion: false,
      };
    case RoomActionTypes.REMOVE_ROOM_DISCUSSION:
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
        activeRoom: {},
        currentRoom: {
          _id: '',
          name: '',
          account: '',
          company: {
            _id: '',
            uniqueName: '',
          },
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
        chats: state.chats,
        roomsUnreadCount: {},
        emojiPicker: false,
        pendingFiles: [],
        companyRooms: state.companyRooms,
        loading: false,
        roomError: '',
        responseCode: 0,
        roomNotification: {},
        totalUnread: 0,
        creatingRoom: false,
        gettingRoom: false,
        gettingRoomMembers: false,
        addingRoomMembers: false,
        sendingMessage: false,
        loadingMessages: false,
        uploadingFile: false,
        archivingRoom: false,
        gettingFiles: false,
        gettingDiscussions: false,
        togglingDiscussion: false,
        updatingLastSeen: false,
        fetchingRooms: false,
        fetchingChats: false,
        errorOnRoomCreate: '',
        errorOnGettingRoom: '',
        errorOnGettingRoomMembers: '',
        errorOnAddingMembers: '',
        errorOnSendingMessage: '',
        errorOnLoadingMessages: '',
        errorOnFileUpload: '',
        errorOnArchive: '',
        errorOnGettingFiles: '',
        errorOnGettingDiscussions: '',
        errorOnToggleDiscussion: '',
        errorOnUpdatingLastSeen: '',
        errorOnFetchingRoom: '',
        errorOnFetchingChats: '',
      };
    case room.COUNT_TOTAL_REED_COUNT:
      return {
        ...state,
        totalUnread: action.payload,
      };
    case LOADING_ROOM:
      return {
        ...state,
        loading: true,
        roomError: '',
      };
    case GET_COMPANY_ROOMS: {
      return {
        ...state,
        companyRooms: action.payload,
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
    // case UPDATE_UNREAD_COUNT_ROOMS: {
    //   return {
    //     ...state,
    //     roomsUnreadCount: updateUnreadCount(
    //       state.roomsUnreadCount,
    //       action.payload,
    //     ),
    //   };
    // }
    // case ACTIVE_ROOM:
    //   return {
    //     ...state,
    //     activeRoom: action.payload,
    //     loading: false,
    //   };
    // case TOGGLE_ROOM_DISCUSSIONS_ERROR:
    // case GET_ROOM_DISCUSSIONS_ERROR:
    // case GET_ROOM_SHARED_FILES_ERROR:
    // case ADD_MEMBER_IN_ROOM_ERROR:
    // case GET_ROOM_MEMBERS_ERROR:
    // case room.CREATE_ROOM_ERROR:
    //   return {
    //     ...state,
    //     roomError: action.payload,
    //     loading: false,
    //   };
    default:
      return state;
  }
};
