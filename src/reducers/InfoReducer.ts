import {
	EDIT_BASIC_INFO, BASIC_INFO
} from "actions/Types";

const InitialState = {
		user: {}
}

export const InfoReducer = (state = InitialState, action: any) => {
	switch (action.type) {
		case BASIC_INFO:
			return {
				...state,
				user: action.payload.user
			}
			case EDIT_BASIC_INFO:
				return {
					...state,
					user: action.payload
				}
		default:
			return state;
	}
};
