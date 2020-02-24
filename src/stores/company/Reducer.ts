import {
	GET_COMPANY_DETAILS,
	CREATE_COMPANY,
	ADD_DEPARTMENT,
	ADD_DEPARTMENT_LOADING,
	COMPANY_DEPARTMENT_LOADING,
	ADD_DEPARTMENT_ERROR,
	GET_ALL_COMPANY_MEMBERS,
	COMPANY_REDUCER_LOADING,
	COMPANY_REDUCER_LOADING_FALSE,
	GET_ALL_DEPARTMENT,
	CLEAR_COMPANY_REDUCER_STATE,
	EDIT_COMPANY_INFO,
	CHANGE_COMPANY_NAME,
	CHANGE_COMPANY_NAME_ERROR,
	CLEAR_CHANGE_COMPANY_NAME_ERROR,
	CHANGE_COMPANY_NAME_LOADING,
	CLEAR_ADD_DEPARTMENT_ERROR,
	CREATE_COMPANY_ERROR,
	COMPANY_DESIGNATION_LOADING,
	ADD_DESIGNATION,
	ADD_DESIGNATION_ERROR,
	EDIT_DESIGNATION,
	EDIT_DESIGNATION_ERROR,
	LOGO_UPLOAD,
	CHANGE_MEMBER_ROLE,
	GET_ALL_COMPANY_PENDING_MEMBERS,
	UPDATE_ALL_COMPANY_PENDING_MEMBERS
} from './Types';
import { User } from 'stores/user/Reducer';
import { Entity } from 'stores/UtilsActions';
import { concat } from 'lodash';

// tslint:disable-next-line: interface-name
export interface IDesignations {
	_id: string;
	division: string;
	position: string;
	department: { _id: string; name: string };
}
// tslint:disable-next-line: interface-name
export interface ICompanyMembers {
	_id: string;
	account: {
		_id: string;
		name: string;
		firstName: string;
		lastName: string;
	};
	role: string;
	designations: [IDesignations];
}

export interface ICompanyTeamMembers {
	_id: string;
	name: string;
	firstName: string;
	lastName: string;
}

export interface ICompanyPendingMembers {
	_id: string;
	email: string;
	removed: boolean;
}

export interface CompanyModel {
	_id: string;
	name: string;
	type: string;
	email: string;
	address: string;
	legalOwnerName: string;
	legalOwnerMail: string;
	employees: User[];
	divisions: Entity[];
	departments: Entity[];
	members: ICompanyMembers[];
	pendingMembers: ICompanyPendingMembers[];
	role: string;
	about: string;
	skill: [{}];
	logo: object;
}

const InitialState = {
	currentCompany: {
		_id: '',
		name: '',
		type: '',
		email: '',
		address: '',
		legalOwnerName: '',
		legalOwnerMail: '',
		members: [],
		pendingMembers: [],
		divisions: [{}],
		departments: [{}],
		role: '',
		about: '',
		skill: [{}],
		logo: {}
	},
	createCompanyError: {
		message: '',
		network: false
	},
	loading: false,
	logoLoading: false,
	changeCompanyNameLoading: false,
	departmentNameLoading: false,
	designationLoading: false,
	error: ''
};

export const CompanyReducer = (state = InitialState, action: any) => {
	switch (action.type) {
		case COMPANY_REDUCER_LOADING:
			return {
				...state,
				loading: true
			};
		case COMPANY_REDUCER_LOADING_FALSE:
			return {
				...state,
				loading: false
			};
		case GET_COMPANY_DETAILS:
			return {
				...state,
				currentCompany: action.payload
			};
		case CREATE_COMPANY:
			return {
				...state,
				currentCompany: action.payload.company
			};
		// case ADD_TEAM_MEMBERS:
		//   return {
		//     ...state,
		//     currentCompany: {
		//       ...state.currentCompany,
		//       members: [
		//         ...state.currentCompany.members,
		//         action.payload.member
		//       ]
		//     }
		//   }

		case GET_ALL_COMPANY_MEMBERS:
			return {
				...state,
				currentCompany: {
					...state.currentCompany,
					members: action.payload.members
				},
				loading: false
			};
		case GET_ALL_COMPANY_PENDING_MEMBERS:
			return {
				...state,
				currentCompany: {
					...state.currentCompany,
					pendingMembers: action.payload
				},
				loading: false
			};
		case UPDATE_ALL_COMPANY_PENDING_MEMBERS:
			return {
				...state,
				currentCompany: {
					...state.currentCompany,
					pendingMembers: state.currentCompany.pendingMembers.concat(action.payload)
				},
				loading: false
			};
		case COMPANY_DEPARTMENT_LOADING:
			return {
				...state,
				departmentNameLoading: true
			};
		case ADD_DEPARTMENT_LOADING:
			return {
				...state,
				departmentNameLoading: true
			};
		case ADD_DEPARTMENT_ERROR:
			return {
				...state,
				error: action.payload,
				departmentNameLoading: false
			};
		case ADD_DEPARTMENT:
			return {
				...state,
				currentCompany: {
					...state.currentCompany,
					departments: [
						...state.currentCompany.departments,
						action.payload.department
					]
				},
				departmentNameLoading: false,
				error: ''
			};
		case CLEAR_ADD_DEPARTMENT_ERROR:
			return {
				...state,
				error: '',
				departmentNameLoading: false
			};
		case GET_ALL_DEPARTMENT:
			return {
				...state,
				currentCompany: {
					...state.currentCompany,
					departments: action.payload.departments
				},
				departmentNameLoading: false
			};
		case CLEAR_COMPANY_REDUCER_STATE:
			return {
				...InitialState
			};

		case EDIT_COMPANY_INFO:
			return {
				...state,
				currentCompany: {
					...state.currentCompany,
					...action.payload
				}
			};
		case CREATE_COMPANY_ERROR:
			return {
				...state,
				createCompanyError: action.payload
			};
		case CHANGE_COMPANY_NAME_LOADING:
			return {
				...state,
				changeCompanyNameLoading: true
			};
		case CHANGE_COMPANY_NAME:
			return {
				...state,
				currentCompany: {
					...state.currentCompany,
					name: action.payload
				},
				changeCompanyNameLoading: false,
				error: ''
			};
		case CHANGE_COMPANY_NAME_ERROR:
			return {
				...state,
				error: action.payload,
				changeCompanyNameLoading: false
			};
		case CLEAR_CHANGE_COMPANY_NAME_ERROR:
			return {
				...state,
				error: '',
				changeCompanyNameLoading: false
			};
		case COMPANY_DESIGNATION_LOADING:
			return {
				...state,
				designationLoading: true
			};
		case ADD_DESIGNATION:
			return {
				...state,
				error: '',
				designationLoading: false
			};
		case ADD_DESIGNATION_ERROR:
			return {
				...state,
				error: action.payload,
				designationLoading: false
			};
		case EDIT_DESIGNATION:
			return {
				...state,
				error: '',
				designationLoading: false
			};
		case EDIT_DESIGNATION_ERROR:
			return {
				...state,
				error: action.payload,
				designationLoading: false
			};
		case LOGO_UPLOAD:
			return {
				...state,
				currentCompany: {
					...state.currentCompany,
					logo: action.payload
				},
			};
		case CHANGE_MEMBER_ROLE:
			return {
				...state,
				currentCompany: {
					...state.currentCompany,
					members: state.currentCompany.members
						.map(
							(member: ICompanyMembers) => {
								if (action.payload.memberId === member._id) {
									return {
										...member,
										role: action.payload.role
									};
								} else {
									return member;
								}
							}
						)
				},
			};
		default:
			return state;
	}
};
