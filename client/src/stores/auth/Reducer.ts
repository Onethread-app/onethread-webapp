import {
  USER_SIGNUP_FAILED,
  USER_SIGNUP_SUCCESS,
  USER_CLEAR_STATE,
  USER_SIGNUP_START,
} from './Types';

export const AuthReducer = (state = [], action) => {
  switch (action.type) {
    case USER_SIGNUP_START:
      return {
        ...state,
        signupLoading: true,
        signupSuccess: false,
        error: '',
      };
    case USER_SIGNUP_SUCCESS:
      return {
        ...state,
        signupLoading: false,
        signupSuccess: true,
        error: '',
      };
    case USER_SIGNUP_FAILED:
      return {
        ...state,
        signupLoading: false,
        signupSuccess: false,
        error: action.payload,
      };
    case USER_CLEAR_STATE:
      return {};
    default:
      return state;
  }
};
