import {
	LOADING_ROOM,
	GET_ROOM_MESSAGES,
	GET_ROOMS,
	CLEAR_ROOM_MESSAGES,
	CURRENT_ROOM,
	NEW_MESSAGE,
	CLEAR_ROOMS_REDUCER_STATE,
	CREATE_ROOM_FROM_SERVER,
	CREATE_ROOM_ERROR, GET_ROOMS_FROM_SERVER
} from "./Types";

const InitialState = {
	roomId: null,
	roomName: null,
	messages: [],
	rooms: [],
	companyRooms: [],
	loading: true,
	roomError: null
};

export const RoomReducer = (state = InitialState, action: any) => {

	switch (action.type) {
		case LOADING_ROOM:
			return {
				...state,
				loading: true
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
				messages: action.payload.roomId === state.roomId && state.messages.length === 0 ? [...state.messages, action.payload] : (state.messages[state.messages.length - 1] as any).id !== action.payload.id ? [...state.messages, action.payload] : [...state.messages],
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
		case GET_ROOMS:
			return {
				...state,
				rooms: action.payload,
				loading: false
			};
		case CLEAR_ROOMS_REDUCER_STATE:
			return {
				...state,
				roomId: null,
				roomName: null,
				messages: [],
				rooms: [],
				loading: false
			};
		case CREATE_ROOM_FROM_SERVER:
			return {
				...state,
				companyRooms: [...state.companyRooms, action.payload],
				loading: false
			};
		case GET_ROOMS_FROM_SERVER:
			return {
				...state,
				companyRooms: action.payload,
				loading: false
			};
		case CREATE_ROOM_ERROR:
			return {
				...state,
				roomError: action.payload,
				loading: false
			}
		default:
			return state;
	}
};
