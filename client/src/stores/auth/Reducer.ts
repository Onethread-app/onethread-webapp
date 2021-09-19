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
        signupError: '',
      };
    case USER_SIGNUP_SUCCESS:
      return {
        ...state,
        signupLoading: false,
        signupError: '',
      };
    case USER_SIGNUP_FAILED:
      return {
        ...state,
        signupLoading: false,
        signupError: action.payload,
      };
    case USER_CLEAR_STATE:
      return {};
    default:
      return state;
  }
};
