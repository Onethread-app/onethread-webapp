import {
	LOADING_ROOM,
	GET_ROOM_MESSAGES,
	GET_ROOMS,
	CLEAR_ROOM_MESSAGES,
	CURRENT_ROOM,
	NEW_MESSAGE,
	CLEAR_ROOMS_REDUCER_STATE,
	CREATE_ROOM_FROM_SERVER,
	CREATE_ROOM_ERROR,
	GET_ROOM_ERROR,
	GET_ROOM_MEMBERS,
	GET_ROOM_MEMBERS_ERROR,
	ADD_MEMBER_IN_ROOM_ERROR,
	ADD_MEMBER_IN_ROOM,
	ACTIVE_ROOM,
	ON_PRESENCE_CHANGE,
	UPDATE_ROOM,
	ON_USER_STARTED_TYPING,
	ON_USER_STOPPED_TYPING,
	CLEAR_ROOMS_ERROR,
	REFRESH_MEMBER,
	TOGGLE_EMOJI_PICKER,
	FILE_UPLOAD,
	CLEAR_FILE_UPLOAD,
	DELETE_ONE_PENDING_FILE,
	ALL_MESSAGE_RECEIVED,
	UNREAD_COUNT_ROOMS,
	ARCHIVE_ROOM
} from './Types';
import { isEmpty } from 'lodash';

export interface IRoom {
	_id: string;
	name: string;
	company: string;
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
	presence: string;
	profileImage?: {
		link: string;
	};
}

export interface IRoomFile {
	_id: string;
	link: string;
	s3Key: string;
	type: string;
	account: string;
	room: string;
	createdAt: string;
	updatedAt: string;
}

export interface IRoomMessage {
	type: string;
	files: IRoomFile[];
	removed: boolean;
	_id: string;
	text: string;
	room: string;
	chatkitId: number;
	account: IRoomMember;
	createdAt: string;
	updatedAt: string;
}

export interface IRoomReducer {
	activeRoom: {};
	currentRoom: IRoom;
	allMessages: boolean;
	messages: IRoomMessage[];
	typing: {
		users: Array<{
			name: string;
			roomId: string;
		}>;
	};
	users: IRoomMember[];
	userStatus: any;
	roomMembers: any[];
	rooms: IRoom[];
	roomsUnreadCount: any;
	loading: boolean;
	emojiPicker: boolean;
	pendingFiles: IRoomFile[];
	roomError: string;

}
const InitialState: IRoomReducer = {
	activeRoom: {},
	currentRoom: {
		_id: '',
		name: '',
		account: '',
		company: '',
		archive: false,
		removed: false,
		createdAt: '',
		updatedAt: ''
	},
	allMessages: false,
	messages: [],
	typing: {
		users: []
	},
	users: [],
	userStatus: {},
	roomMembers: [],
	rooms: [],
	roomsUnreadCount: {},
	emojiPicker: false,
	pendingFiles: [],
	loading: false,
	roomError: '',
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
	return createdAtA > createdAtB ?
		1 : createdAtA < createdAtB ?
			-1 : 0;
};

const userStatus = (arr: any) => {
	const obj = {};
	arr.forEach((e: any) => {
		obj[e.id] = e.presence.state;
	});
	return obj;
};

const updateUnreadCount = (roomsUnreadCount: any, updatedRoom: any) => {
	roomsUnreadCount[updatedRoom.id] = updatedRoom.unreadCount;
	return roomsUnreadCount;
};

export const RoomReducer = (state = InitialState, action: any) => {
	switch (action.type) {
		case LOADING_ROOM:
			return {
				...state,
				loading: true,
				roomError: ''
			};
		case FILE_UPLOAD: {
			return {
				...state,
				pendingFiles: [...state.pendingFiles, action.payload],
			};
		}
		case UNREAD_COUNT_ROOMS: {
			return {
				...state,
				roomsUnreadCount: action.payload,
			};
		}
		case DELETE_ONE_PENDING_FILE: {
			return {
				...state,
				pendingFiles: state.pendingFiles.filter((file: IRoomFile) => {
					return file._id !== action.payload;
				}),
			};
		}
		case CLEAR_FILE_UPLOAD: {
			return {
				...state,
				pendingFiles: [],
			};
		}
		case ON_USER_STARTED_TYPING:
			return {
				...state,
				typing: {
					users: [...state.typing.users, action.payload]
				},
				loading: false
			};
		case ON_USER_STOPPED_TYPING:
			return {
				...state,
				typing: {
					...state.typing, users: state.typing.users.filter((user: any) => {
						return user.name !== action.payload.name;
					})
				},
				loading: false
			};
		case GET_ROOM_MEMBERS:
			return {
				...state,
				users: action.payload,
				loading: false
			};
		case ADD_MEMBER_IN_ROOM:
			return {
				...state,
				users: [...state.users, ...action.payload],
				loading: false
			};
		case ACTIVE_ROOM:
			return {
				...state,
				activeRoom: action.payload,
				userStatus: userStatus(action.payload.users),
				loading: false
			};
		case REFRESH_MEMBER:
		case ON_PRESENCE_CHANGE:
			return {
				...state,
				userStatus: !isEmpty(state.activeRoom) ? userStatus((state.activeRoom as any).users) : state.userStatus,
				loading: false
			};
		case CURRENT_ROOM:
			return {
				...state,
				currentRoom: action.payload,
				loading: false
			};
		case NEW_MESSAGE:
			return {
				...state,
				messages:
					action.payload.room === (state.activeRoom as any).id
						? state.messages.length === 0 ||
							(state.messages[state.messages.length - 1] as IRoomMessage)._id !==
							action.payload._id
							? [...state.messages, action.payload]
							: [...state.messages]
						: [...state.messages],
				loading: false
			};
		case GET_ROOM_MESSAGES:
			return {
				...state,
				messages: [...action.payload, ...state.messages],
				loading: false
			};
		case ALL_MESSAGE_RECEIVED:
			return {
				...state,
				allMessages: action.payload
			};
		case CLEAR_ROOM_MESSAGES:
			return {
				...state,
				messages: [],
				loading: false
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
				roomsUnreadCount: updateUnreadCount(state.roomsUnreadCount, action.payload),
				loading: false
			};
		case ARCHIVE_ROOM:
			return {
				...state,
				currentRoom: { ...state.currentRoom, archive: action.payload.archive },
				rooms: state.rooms
					.map((room: IRoom) => {
						if (room._id === action.payload.roomId) {
							return {
								...room,
								archive: action.payload.archive
							};
						} else {
							return room;
						}
					}),
				loading: false
			};
		case GET_ROOMS:
			return {
				...state,
				rooms: action.payload.sort(sortRooms),
				loading: false
			};
		case CREATE_ROOM_FROM_SERVER:
			return {
				...state,
				rooms: [...state.rooms, {
					_id: action.payload._id,
					name: action.payload.name,
					company: action.payload.company,
					account: action.payload.account,
					createdAt: action.payload.createdAt,
					updatedAt: action.payload.updatedAt,
					archive: action.payload.archive,
					removed: action.payload.removed
				}],
				roomError: '',
				loading: false
			};

		case TOGGLE_EMOJI_PICKER:
			return {
				...state,
				emojiPicker: action.payload
			};
		case ADD_MEMBER_IN_ROOM_ERROR:
		case GET_ROOM_MEMBERS_ERROR:
		case CREATE_ROOM_ERROR:
		case GET_ROOM_ERROR:
			return {
				...state,
				roomError: action.payload,
				loading: false
			};
		case CLEAR_ROOMS_ERROR:
			return {
				...state,
				roomError: ''
			};
		case CLEAR_ROOMS_REDUCER_STATE:
			return {
				...InitialState
			};
		default:
			return state;
	}
};
