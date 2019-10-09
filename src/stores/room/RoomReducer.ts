import {
	LOADING_ROOM,
	GET_ROOM_MESSAGES,
	GET_ROOMS,
	CLEAR_ROOM_MESSAGES,
	CURRENT_ROOM,
	NEW_MESSAGE
} from "./Types";

const InitialState = {
	roomId: null,
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
				roomId: action.payload,
				loading: false
			};
		case NEW_MESSAGE:
			return {
				...state,
				messages: state.messages.length > 0 && state.messages[state.messages.length - 1].id != action.payload.id ? [...state.messages, action.payload] : [...state.messages],
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
		default:
			return state;
	}
};
