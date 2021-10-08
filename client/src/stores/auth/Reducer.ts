import {
  USER_SIGNUP_FAILURE,
  USER_SIGNUP_SUCCESS,
  USER_CLEAR_STATE,
  USER_SIGNUP_START,
  USER_CHANGE_EMAIL_START,
  USER_CHANGE_EMAIL_SUCCESS,
  USER_CHANGE_EMAIL_FAILURE,
} from './Types';

export const AuthReducer = (state = [], action) => {
  switch (action.type) {
    case USER_SIGNUP_START:
      return {
        ...state,
        signupLoading: true,
        signupError: '',
      };
    case USER_SIGNUP_SUCCESS:
      return {
        ...state,
        signupLoading: false,
        signupError: '',
      };
    case USER_SIGNUP_FAILURE:
      return {
        ...state,
        signupLoading: false,
        signupError: action.payload,
      };
    case USER_CLEAR_STATE:
      return {};
    case USER_CHANGE_EMAIL_START:
      return {
        ...state,
        changeEmailLoading: true,
        changeEmailFailure: '',
      };
    case USER_CHANGE_EMAIL_SUCCESS:
      return {
        ...state,
        changeEmailLoading: false,
      };
    case USER_CHANGE_EMAIL_FAILURE:
      return {
        ...state,
        changeEmailLoading: false,
        changeEmailFailure: action.payload,
      };
    default:
      return state;
  }
};
