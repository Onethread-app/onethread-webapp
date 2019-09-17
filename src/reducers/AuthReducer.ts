import { USER_SIGNUP, USER_LOGIN_ERROR, USER_LOGIN, FETCH_USER, USER_SIGNUP_LOADING } from 'actions/Types';

export interface UserModel {
  firstName: string,
  lastName: string,
  contactNo: string,
  email: string,
  password: string,
  confirmPassword: string,
}

const InitialState = {
  user: {},
  loginError: {},
  loading: false,
  token: localStorage.hasOwnProperty("token")
    ? JSON.parse(localStorage.getItem("token")!) : "",
}

export const AuthReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case USER_SIGNUP_LOADING:
      return {
        ...state,
        loading: true
      }
    case USER_SIGNUP:
      return {
        ...state,
        user: action.payload,
        loading: false
      }
    case USER_LOGIN:
      return {
        ...state,
        user: action.payload.user,
        loading: false
      }
    case FETCH_USER:
      return {
        ...state,
        user: action.payload,
        loading: false
      }
    case USER_LOGIN_ERROR:
      return {
        ...state,
        loginError: action.payload,
        loading: false
      }
    default:
      return state;
  }
}