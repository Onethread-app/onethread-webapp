import { USER_FETCH_LOADING, USER_FETCH_ERROR, BASIC_INFO, USER_COMPANIES_UPDATE, FETCH_USER, EDIT_BASIC_INFO, ADD_EXPERIENCE, EDIT_BASIC_INFO_ERROR,} from './Types';
export interface User {
	_id: string,
	email: string
	firstName: string
	lastName: string;
	name: string;
	accountVerified: boolean,
	role: string,
	contactNo: string,
	gender: string,
	secondaryEmail: string,
	bloodGroup: string,
	location: string,
	about: string,
	birthDate: Date,
	companies: Object[],
	friends: string[],
	pendingFriends: string[],
	sendingFriendList: string[],
	timeline: string[]
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
		gender: "",
		secondaryEmail: "",
		bloodGroup: "",
		location: "",
		about: "",
		birthDate: "",
		companies: [],
		friends: [],
		pendingFriends: [],
		sendingFriendList: [],
		timeline: []
	},
	loading: false,
	error: ''
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
				error: action.payload,
				loading: false
			}
		case BASIC_INFO:
			return {
				...state,
				user: action.payload.user
			}
		case EDIT_BASIC_INFO:
			return {
				...state,
				user: {
					...state.user,
					...action.payload
				}
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
		case ADD_EXPERIENCE: {
			return {
			...state,
				user: {
					...state.user,
					timeline: [
						...state.user.timeline,
						action.payload
					]
				}
		}
	}
	case EDIT_BASIC_INFO_ERROR: {
		return {
			...state,
			error: action.payload,
			loading: false
		}
}	
	
		default:
			return state;
	}
};
