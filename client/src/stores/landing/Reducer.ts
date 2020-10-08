import { LANDING_APIS } from './Types';

export interface IContactForm {
  response?: string;
}

const InitialState = {
  contactForm: {
    response: null,
  },
};

export const LandingReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case LANDING_APIS.SAVE_CONTACT_FORM_SUCCESS: {
      return {
        ...state,
        contactForm: {
          response: action.payload,
        },
      };
    }
    case LANDING_APIS.SAVE_CONTACT_FORM_FAILURE: {
      return {
        ...state,
        contactForm: {
          response: action.payload,
        },
      };
    }
    case LANDING_APIS.RESET_CONTACT_FORM_RESPONSE: {
      return {
        ...state,
        contactForm: {
          response: null,
        },
      };
    }
    default:
      return state;
  }
};
