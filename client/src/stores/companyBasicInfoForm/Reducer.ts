import { SAVE_COMPANY_BASIC_INFO_FORM } from './Types';

const InitialState = {
  data: {},
};

export const CompanyBasicInfoFormReducer = (
  state = InitialState,
  action: any,
) => {
  switch (action.type) {
    case SAVE_COMPANY_BASIC_INFO_FORM:
      return {
        ...state,
        data: {
          name: action.payload.name,
          type: action.payload.type,
          address: action.payload.address,
          email: action.payload.email,
          legalOwnerName: action.payload.legalOwnerName,
          legalOwnerMail: action.payload.legalOwnerMail,
        },
      };

    default:
      return state;
  }
};
