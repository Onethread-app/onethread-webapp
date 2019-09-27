import {
	EDIT_BASIC_INFO, BASIC_INFO, FETCH_USER, USER_FETCH_LOADING, USER_FETCH_ERROR
} from "actions/Types";

const InitialState = {
	user: {},
	loading: false,
	fetchError: ''
}

export const UserReducer = (state = InitialState, action: any) => {
	switch (action.type) {
		case USER_FETCH_LOADING:
      return {
        ...state,
        loading: true,
			}
			case USER_FETCH_ERROR:
      return {
        ...state,
				fetchError: action.payload,
				loading: false
      }
		case BASIC_INFO:
			return {
				...state,
				user: action.payload.user
			}
		case FETCH_USER:
			return {
				...state,
				user: action.payload,
				loading: false
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
