import { GET_COMPANY_DETAILS, CREATE_COMPANY, ADD_TEAM_MEMBERS } from './Types';
import { User } from 'stores/user/Reducer';

export interface CompanyModel {
  _id: string,
  name: string,
  type: string,
  email: string,
  address: string
  legalOwnerName: string,
  legalOwnerMail: string,
  employees: User[]
}

const InitialState = {
  currentCompany: {}
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
    default:
      return state;
  }
}