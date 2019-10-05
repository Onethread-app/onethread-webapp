import {
	ROOM_LOADING,
	GET_ROOMS,
	CREATE_ROOMS,
	GET_ROOM_MESSAGES,
	SEND_ROOM_MESSAGE
} from "actions/Types";

const InitialState = {
	roomId: null,
	messages: [{}],
	rooms: [],
	loading: false
};

export const RoomReducer = (state = InitialState, action: any) => {
	switch (action.type) {
		case ROOM_LOADING:
			return {
				...state,
				loading: true
			};
		case GET_ROOMS:
			return {
				...state,
				user: action.payload,
				loading: false
			};
		case CREATE_ROOMS:
			return {
				...state,
				user: action.payload,
				loading: false
			};
		case GET_ROOM_MESSAGES:
			return {
				...state,
				user: action.payload.user,
				loading: false
			};
		case SEND_ROOM_MESSAGE:
			return {
				...state,
				user: action.payload.user,
				loading: false
			};
		default:
			return state;
	}
};
