import { USER_SIGNUP_LOADING, USER_LOGIN_ERROR, USER_LOGIN, USER_LOGOUT, CLEAR_AUTH_REDUCER_STATE, USER_SIGNUP_LOADING_FALSE } from './Types'

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
  },
  loading: false,
  token: localStorage.hasOwnProperty("token")
    ? JSON.parse(localStorage.getItem("token")!) : null,
}

export const AuthReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case USER_SIGNUP_LOADING:
      return {
        ...state,
        loading: true,
      }
    case USER_SIGNUP_LOADING_FALSE:
      return {
        ...state,
        loading: false,
      }
    case USER_LOGIN_ERROR:
      return {
        ...state,
        loginError: action.payload,
        loading: false
      }
    // case USER_SIGNUP:
    //   return {
    //     ...state,
    //     token: action.payload.token,
    //     loginError: {
    //       message: "",
    //       email: false,
    //       password: false,
    //       network: false
    //     },
    //     loading: false
    //   }
    case USER_LOGIN:
      return {
        ...state,
        token: action.payload.token,
        loginError: {
          message: "",
          email: false,
          password: false,
          network: false
        },
        loading: false
      }

    case USER_LOGOUT:
      return {
        ...state,
        token: "",
        loginError: {
          message: "",
          email: false,
          password: false,
          network: false
        },
        loading: false
      }
    case CLEAR_AUTH_REDUCER_STATE:
      return {
        loginError: {
          message: "",
          email: false,
          password: false,
          network: false
        },
        loading: false,
        token: null
      }
    default:
      return state;
  }
}