import {
	LOADING_ROOM,
	GET_ROOM_MESSAGES,
	GET_ROOMS,
	CLEAR_ROOM_MESSAGES,
	CURRENT_ROOM,
	NEW_MESSAGE,
	CLEAR_ROOMS
} from "./Types";

const InitialState = {
	roomId: null,
	roomName: null,
	messages: [{ id: null }],
	rooms: [],
	loading: false
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
				messages: state.messages.length > 0 && state.messages[state.messages.length - 1].id !== action.payload.id && action.payload.roomId === state.roomId ? [...state.messages, action.payload] : [...state.messages],
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
		case CLEAR_ROOMS:
			return {
				...state,
				roomId: null,
				roomName: null,
				messages: [{ id: null }],
				rooms: [],
				loading: false
			}
		default:
			return state;
	}
};
