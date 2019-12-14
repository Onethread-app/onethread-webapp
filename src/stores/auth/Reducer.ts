import { USER_LOGIN_ERROR, USER_SIGNUP, USER_LOGIN, USER_LOGOUT, CLEAR_AUTH_REDUCER_STATE } from './Types'

export interface UserModel {
  firstName: string,
  lastName: string,
  contactNo: string,
  email: string,
  password: string,
  confirmPassword: string
}

const InitialState = {
  loginError: {
    message: "",
    email: false,
    password: false,
    network: false
  }
}

export const AuthReducer = (state = InitialState, action: any) => {
  switch (action.type) {

    case USER_LOGIN_ERROR:
      return {
        ...state,
        loginError: action.payload
      }
    case USER_SIGNUP:
      return {
        ...state,
        loginError: {
          message: "",
          email: false,
          password: false,
          network: false
        },
        loading: false
      }
    case USER_LOGIN:
      return {
        ...state,
        loginError: {
          message: "",
          email: false,
          password: false,
          network: false
        }
      }
    case USER_LOGOUT:
    case CLEAR_AUTH_REDUCER_STATE:
      return {
        ...state,
        loginError: {
          message: "",
          email: false,
          password: false,
          network: false
        },
        loading: false,
      }
    default:
      return state;
  }
}