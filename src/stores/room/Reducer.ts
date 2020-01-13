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
	GET_ROOM_MEMBERS_FROM_SERVER,
	GET_ROOM_MEMBERS_FROM_SERVER_ERROR,
	ADD_MEMBER_IN_ROOM_ERROR,
	ADD_MEMBER_IN_ROOM,
	ACTIVE_ROOM,
	ON_PRESENCE_CHANGE,
	UPDATE_ROOM,
	ON_USER_STARTED_TYPING,
	ON_USER_STOPPED_TYPING,
	CLEAR_ROOMS_ERROR, REFRESH_MEMBER, TOGGLE_EMOJI_PICKER, GET_ROOMS_FROM_FORM, GET_ROOMS_FROM_ROOM
} from './Types';
import { isEmpty } from 'lodash';

// tslint:disable-next-line: interface-name
export interface IRoom {
	id: string;
	name: string;
	unreadCount: number;
}

// tslint:disable-next-line: interface-name
interface IAppState {
	activeRoom: {};
	roomId: string;
	roomName: string;
	messages: any[];
	typing: {
		users: Array<{ name: string, roomId: string; }>
	};
	users: any[];
	roomMembers: any[];
	rooms: [IRoom];
	companyRooms: any[];
	loading: boolean;
	emojiPicker: boolean;
	roomError: string;
}
const InitialState: IAppState = {
	activeRoom: {},
	roomId: '',
	roomName: '',
	messages: [],
	typing: {
		users: []
	},
	users: [],
	roomMembers: [],
	rooms: [{ id: '', name: '', unreadCount: 0 }],
	companyRooms: [],
	emojiPicker: false,
	loading: false,
	roomError: '',
};

const sortRooms = (a: any, b: any) => {
	// tslint:disable-next-line: one-variable-per-declaration
	const unreadCountA = a.unreadCount,
		unreadCountB = b.unreadCount,
		nameA = a.name.toLowerCase(),
		nameB = b.name.toLowerCase();
	return unreadCountA > unreadCountB ? -1 : unreadCountA < unreadCountB ? 1 : nameA > nameB ? 1 : nameA < nameB ? -1 : 0;
};

export const RoomReducer = (state = InitialState, action: any) => {
	switch (action.type) {
		case LOADING_ROOM:
			return {
				...state,
				loading: true,
				roomError: ''
			};
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
		case ACTIVE_ROOM:
			return {
				...state,
				activeRoom: action.payload,
				users: action.payload.users
					.map(
						(user: {
							id: string;
							name: string;
							presence: { state: string };
						}) => ({
							id: user.id,
							name: user.name,
							presence: user.presence.state
						})
					)
					.sort((user: any) => {
						if (user.presence === 'online') { return -1; }
						return 1;
					}),
				loading: false
			};
		case REFRESH_MEMBER:
		case ON_PRESENCE_CHANGE:
			return {
				...state,
				users:
					!isEmpty(state.activeRoom) &&
					(state.activeRoom as any).users
						.map(
							(user: {
								id: string;
								name: string;
								presence: { state: string };
							}) => ({
								id: user.id,
								name: user.name,
								presence: user.presence.state
							})
						)
						.sort((user: any) => {
							if (user.presence === 'online') { return -1; }
							return 1;
						}),
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
					action.payload.roomId === (state.activeRoom as any).id
						? state.messages.length === 0 ||
							(state.messages[state.messages.length - 1] as any).id !==
							action.payload.id
							? [...state.messages, action.payload]
							: [...state.messages]
						: [...state.messages],
				loading: false
			};
		case GET_ROOM_MESSAGES:
			return {
				...state,
				messages: action.payload,
				loading: false
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
							return action.payload;
						} else {
							return room;
						}
					})
					.sort(sortRooms),
				loading: false
			};
		case GET_ROOMS_FROM_FORM:
		case GET_ROOMS_FROM_ROOM:
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
					unreadCount: 0
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
		case GET_ROOM_MEMBERS_FROM_SERVER:
			return {
				...state,
				roomMembers: action.payload,
				loading: false
			};
		case ADD_MEMBER_IN_ROOM:
			return {
				...state,
				roomMembers: [...state.roomMembers, ...action.payload],
				loading: false
			};
		case TOGGLE_EMOJI_PICKER:
			return {
				...state,
				emojiPicker: action.payload
			};
		case ADD_MEMBER_IN_ROOM_ERROR:
		case GET_ROOM_MEMBERS_FROM_SERVER_ERROR:
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
