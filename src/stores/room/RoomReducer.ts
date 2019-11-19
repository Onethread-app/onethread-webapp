import {
	LOADING_ROOM,
	GET_ROOM_MESSAGES,
	GET_ROOMS,
	CLEAR_ROOM_MESSAGES,
	CURRENT_ROOM,
	NEW_MESSAGE,
	CLEAR_ROOMS_REDUCER_STATE,
	CREATE_ROOM_FROM_SERVER,
	CREATE_ROOM_ERROR, GET_ROOMS_FROM_SERVER, GET_ROOM_ERROR, GET_ROOM_MEMBERS_FROM_SERVER, GET_ROOM_MEMBERS_FROM_SERVER_ERROR, ADD_MEMBER_IN_ROOM_ERROR, ADD_MEMBER_IN_ROOM, ACTIVE_ROOM, ON_PRESENCE_CHANGE, UPDATE_ROOM, ON_USER_STARTED_TYPING, ON_USER_STOPPED_TYPING, CLEAR_ROOMS_ERROR
} from "./Types";
import { isEmpty } from 'lodash';
interface IAppState {
	activeRoom: {},
	roomId: string,
	roomName: string,
	messages: any[],
	typingUsers: any[],
	users: any[],
	roomMembers: any[],
	rooms: any[],
	companyRooms: any[],
	loading: boolean,
	roomError: string,
}
const InitialState: IAppState = {
	activeRoom: {},
	roomId: "",
	roomName: "",
	messages: [],
	typingUsers: [],
	users: [],
	roomMembers: [],
	rooms: [],
	companyRooms: [],
	loading: false,
	roomError: "",
};

export const RoomReducer = (state = InitialState, action: any) => {

	switch (action.type) {
		case LOADING_ROOM:
			return {
				...state,
				loading: true,
				roomError: ""
			};
		case ON_USER_STARTED_TYPING:
			return {
				...state,
				typingUsers: [...state.typingUsers, action.payload],
				loading: false
			};
		case ON_USER_STOPPED_TYPING:
			return {
				...state,
				typingUsers: state.typingUsers.filter((user: any) => {
					return user !== action.payload;
				}),
				loading: false
			};
		case ACTIVE_ROOM:
			return {
				...state,
				activeRoom: action.payload,
				users: action.payload.users.map((user: { id: string, name: string, presence: { state: string } }) => ({
					id: user.id,
					name: user.name,
					presence: user.presence.state
				})).sort((user: any) => {
					if (user.presence === 'online') return -1;
					return 1;
				}),
				loading: false
			};
		case ON_PRESENCE_CHANGE:
			return {
				...state,
				users: !isEmpty(state.activeRoom) && (state.activeRoom as any).users.map((user: { id: string, name: string, presence: { state: string } }) => ({
					id: user.id,
					name: user.name,
					presence: user.presence.state
				})).sort((user: any) => {
					if (user.presence === 'online') return -1;
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
				messages: action.payload.roomId === (state.activeRoom as any).id ? state.messages.length === 0 || (state.messages[state.messages.length - 1] as any).id !== action.payload.id ? [...state.messages, action.payload] : [...state.messages] : [...state.messages],
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
				rooms: state.rooms.map((room: any) => {
					if (room.id === action.payload.id) {
						return action.payload;
					} else {
						return room;
					}
				}),
				loading: false
			};
		case GET_ROOMS:
			return {
				...state,
				rooms: action.payload.sort((a: any, b: any) => {
					a = a.unreadCount;
					b = b.unreadCount;
					return a > b ? -1 : a < b ? 1 : 0;
				}),
				loading: false
			};
		case CREATE_ROOM_FROM_SERVER:
			return {
				...state,
				companyRooms: [...state.companyRooms, action.payload],
				roomError: "",
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
				roomError: ""
			};
		case CLEAR_ROOMS_REDUCER_STATE:
			return {
				...InitialState
			};
		default:
			return state;
	}
};
