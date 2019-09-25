import { CREATE_COMPANY } from 'actions/Types';

export interface CopmpanyModel {
  companyName: string,
  companyType: string,
  companyMail: string,
  companyAddress: string
  legalOwnerName: string,
  legalOwnerMail: string
}

const InitialState = {
  createCompany: {}
}

export const CompanyReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case CREATE_COMPANY:
      return {
        ...state,
        createCompany: action.payload.newCompany
      }

    default:
      return state;
  }
}