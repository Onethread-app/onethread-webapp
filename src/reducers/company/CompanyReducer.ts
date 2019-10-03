import { CREATE_COMPANY, GET_COMPANY_DETAILS } from 'actions/Types';

export interface CompanyModel {
  _id: string,
  name: string,
  type: string,
  email: string,
  address: string
  legalOwnerName: string,
  legalOwnerMail: string
}

const InitialState = {
  currentCompany: {}
}

export const CompanyReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case GET_COMPANY_DETAILS:
      return {
        ...state,
        currentCompany:action.payload.company
      }
    case CREATE_COMPANY:
      return {
        ...state,
        currentCompany: action.payload.company
      }
    default:
      return state;
  }
}