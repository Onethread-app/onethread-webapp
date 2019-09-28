import { CREATE_COMPANY, SELECT_COMPANY } from 'actions/Types';

export interface CompanyModel {
  _id: string,
  companyName: string,
  companyType: string,
  companyMail: string,
  companyAddress: string
  legalOwnerName: string,
  legalOwnerMail: string
}

const InitialState = {
  company: {}
}

export const CompanyReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case CREATE_COMPANY:
      return {
        ...state,
        company: action.payload.newCompany
      }
    case SELECT_COMPANY:
      return {
        ...state,
        company:action.payload.company
      }
    default:
      return state;
  }
}