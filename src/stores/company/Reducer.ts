import { GET_COMPANY_DETAILS, CREATE_COMPANY, ADD_DEPARTMENT, COMPANY_DEPARTMENT_LOADING, ADD_DEPARTMENT_ERROR, GET_ALL_COMPANY_MEMBERS, COMPANY_REDUCER_LOADING, COMPANY_REDUCER_LOADING_FALSE, GET_ALL_DEPARTMENT, CLEAR_COMPANY_REDUCER_STATE } from './Types';
import { User } from 'stores/user/Reducer';
import { Entity } from 'stores/UtilsActions';

export interface ICompanyMembers {
  _id: string,
  account: {
    _id: string;
    name: string;
  },
  role: string;
  designations: []
}
export interface CompanyModel {
  _id: string,
  name: string,
  type: string,
  email: string,
  address: string
  legalOwnerName: string,
  legalOwnerMail: string,
  employees: User[],
  divisions: Entity[],
  departments: Entity[],
  members: [ICompanyMembers];
  role: string;
}

const InitialState = {
  currentCompany: {
    _id: "",
    name: "",
    type: "",
    email: "",
    address: "",
    legalOwnerName: "",
    legalOwnerMail: "",
    members: [{}],
    divisions: [{}],
    departments: [{}],
    role: ""
  },
  loading: false,
  error: ''
}

export const CompanyReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case COMPANY_REDUCER_LOADING:
      return {
        ...state,
        loading: true,
      }
    case COMPANY_REDUCER_LOADING_FALSE:
      return {
        ...state,
        loading: false,
      }
    case GET_COMPANY_DETAILS:
      return {
        ...state,
        currentCompany: action.payload.company
      }
    case CREATE_COMPANY:
      return {
        ...state,
        currentCompany: action.payload.company
      }
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
      }
    case COMPANY_DEPARTMENT_LOADING:
      return {
        ...state,
        loading: true
      }
    case ADD_DEPARTMENT_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case ADD_DEPARTMENT:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          departments: [...state.currentCompany.departments, action.payload.department]
        },
        loading: false
      };
    case GET_ALL_DEPARTMENT:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          departments: action.payload.departments
        },
        loading: false
      };
    case CLEAR_COMPANY_REDUCER_STATE:
      return {
        currentCompany: {},
        loading: false,
        error: ''
      }
    default:
      return state;
  }
}