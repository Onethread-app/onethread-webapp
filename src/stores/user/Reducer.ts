import { USER_FETCH_LOADING, USER_FETCH_ERROR, BASIC_INFO, USER_COMPANIES_UPDATE, FETCH_USER, EDIT_BASIC_INFO } from './Types';

export interface User {
	_id: string,
	email: string
	firstName: string
	lastName: string;
	name: string;
	accountVerified: boolean,
	role: string,
	contactNo: string,
	companies: Object[],
	friends: string[],
	pendingFriends: string[],
	sendingFriendList: string[]
}


const InitialState = {
	user: {
		_id: "",
		email: "",
		firstName: "",
		lastName: "",
		name: "",
		accountVerified: false,
		role: "",
		contactNo: "",
		companies: [],
		friends: [],
		pendingFriends: [],
		sendingFriendList: []
	},
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
		case USER_COMPANIES_UPDATE:
			return {
				...state,
				user: {
					...state.user,
					companies: [
						...state.user.companies,
						action.payload
					]
				}
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
