import { GET_COMPANY_DETAILS, CREATE_COMPANY, ADD_TEAM_MEMBERS, ADD_DIVISION, ADD_DEPARTMENT, ADD_DIVISION_ERROR, ADD_DIVISION_LOADING, ADD_DEPARTMENT_LOADING, ADD_DEPARTMENT_ERROR } from './Types';
import { User } from 'stores/user/Reducer';
import { Entity } from 'stores/UtilsActions';
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
  departments: Entity[]
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
    employees: [{}],
    divisions: [{}],
    departments: [{}]
  },
  loading: false,
  error: ''
}

export const CompanyReducer = (state = InitialState, action: any) => {
  switch (action.type) {
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
    case ADD_TEAM_MEMBERS:
      return {
        ...state,
        currentCompany: action.payload
      }
    case ADD_DIVISION_LOADING:
      return {
        ...state,
        loading: true
      }
    case ADD_DIVISION_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case ADD_DIVISION:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          divisions: [...state.currentCompany.divisions, action.payload.division]
        },
      };
    case ADD_DEPARTMENT_LOADING:
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
      };
    default:
      return state;
  }
}