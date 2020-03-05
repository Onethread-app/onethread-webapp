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
	GET_ROOMS_FROM_SERVER,
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
	ALL_MESSAGE_RECEIVED
} from './Types';
import { isEmpty } from 'lodash';

export interface IRoom {
	id: string;
	name: string;
	unreadCount: number;
	company: string;
	account: string;
	createdAt: string;
	updatedAt: string;
	archive: boolean;
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
	roomId: string;
	roomName: string;
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
	companyRooms: any[];
	loading: boolean;
	emojiPicker: boolean;
	pendingFiles: IRoomFile[];
	roomError: string;

}
const InitialState: IRoomReducer = {
	activeRoom: {},
	roomId: '',
	roomName: '',
	allMessages: false,
	messages: [],
	typing: {
		users: []
	},
	users: [],
	userStatus: {},
	roomMembers: [],
	rooms: [],
	companyRooms: [],
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
	const c = {};
	arr.forEach((e: any) => {
		c[e.id] = e.presence.state;
	});
	return c;
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
				// users: action.payload.users
				// 	.map(
				// 		(user: {
				// 			id: string;
				// 			name: string;
				// 			presence: { state: string };
				// 		}) => ({
				// 			id: user.id,
				// 			name: user.name,
				// 			presence: user.presence.state
				// 		})
				// 	),
				userStatus: userStatus(action.payload.users),
				// .sort((user: any) => {
				// 	if (user.presence === 'online') { return -1; }
				// 	return 1;
				// }),
				loading: false
			};
		case REFRESH_MEMBER:
		case ON_PRESENCE_CHANGE:
			return {
				...state,
				// users:
				// 	!isEmpty(state.activeRoom) ?
				// 		(state.activeRoom as any).users
				// 			.map(
				// 				(user: {
				// 					id: string;
				// 					name: string;
				// 					presence: { state: string };
				// 				}) => ({
				// 					id: user.id,
				// 					name: user.name,
				// 					presence: user.presence.state
				// 				})
				// 			)
				// 		// .sort((user: any) => {
				// 		// 	if (user.presence === 'online') { return -1; }
				// 		// 	return 1;
				// 		// }) 
				// 		: [...state.users],
				userStatus: !isEmpty(state.activeRoom) ? userStatus((state.activeRoom as any).users) : state.userStatus,
				loading: false
			};
		case CURRENT_ROOM:
			return {
				...state,
				roomId: action.payload.roomId,
				roomName: action.payload.name,
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
				rooms: state.rooms
					.map((room: IRoom) => {
						if (room.id === action.payload.id) {
							return {
								id: action.payload.id,
								name: action.payload.name,
								unreadCount: action.payload.unreadCount,
								company: action.payload.customData.company,
								account: action.payload.createdByUserId,
								createdAt: action.payload.createdAt,
								updatedAt: action.payload.updatedAt,
								archive: room.archive
							};
						} else {
							return room;
						}
					}).sort(sortRooms)
				,
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
				companyRooms: [...state.companyRooms, action.payload],
				rooms: [...state.rooms, {
					id: action.payload._id,
					name: action.payload.name,
					unreadCount: 0,
					company: action.payload.company,
					account: action.payload.account,
					createdAt: action.payload.createdAt,
					updatedAt: action.payload.updatedAt
				}],
				roomError: '',
				loading: false
			};
		case GET_ROOMS_FROM_SERVER:
			return {
				...state,
				companyRooms: action.payload,
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
