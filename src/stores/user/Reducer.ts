import { USER_FETCH_LOADING, USER_FETCH_ERROR, BASIC_INFO, USER_COMPANIES_UPDATE, FETCH_USER, EDIT_BASIC_INFO, ADD_EXPERIENCE, EDIT_BASIC_INFO_ERROR, CLEAR_USER_REDUCER_STATE, ADD_SKILL, DELETE_SKILL, IMAGE_UPLOAD } from './Types';
import { ItemEntityProps } from 'components/fields/SuggestField';

export interface ICompanyByUser {
	role: string;
	company: {
		_id: string;
		name: string;
	}
}

export interface IProfilePhoto {
	_id: string;
	link: string;
	s3key: string;
	type: string;
	imageSource: string;
}

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
	companies: ICompanyByUser[],
	friends: string[],
	pendingFriends: string[],
	sendingFriendList: string[],
	timeline: string[],
	skillArea: ItemEntityProps[];
	profileImage: IProfilePhoto
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
		timeline: [],
		skillArea: [],
		profileImage: {}
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
				user: {
					...state.user,
					...action.payload
				}
			}
		case EDIT_BASIC_INFO:
			return {
				...state,
				user: {
					...state.user,
					...action.payload,
					loading: false
				}
			}
		case ADD_SKILL:
			return {
				...state,
				user: {
					...state.user,
					skillArea: [...action.payload]
				}
			}
		case DELETE_SKILL:
			return {
				...state,
				user: {
					...state.user,
					skillArea: [...action.payload]
				}
			}
		case USER_COMPANIES_UPDATE:
			return {
				...state,
				user: {
					...state.user,
					companies: action.payload.companies
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
					timeline: action.payload
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
		case CLEAR_USER_REDUCER_STATE:
			return {
				...InitialState
			}
		case IMAGE_UPLOAD: {
			return {
				...state,
				user: {
					...state.user,
					profileImage: action.payload
			},
		}
	}
		default:
			return state;
	}
};
