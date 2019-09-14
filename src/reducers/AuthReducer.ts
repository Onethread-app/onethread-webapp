import { NEW_USER, LOGIN_ERROR } from 'actions/Types';

export interface UserModel {
  firstName: string,
  lastName: string,
  contactNo: string,
  email: string,
  password: string,
  confirmPassword: string,
}

// interface ResponseUserProps {
//   loading: boolean;
//   userResponse: {
//     token: string
//     firstName: string;
//     lastName: string;
//   }
// }

const InitialState = {
  user: {}
}

export const AuthReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case NEW_USER:
      return {
        ...state,
        user: action.payload
      }
    default:
      return state;
  }
}

export const LoginErrorReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case LOGIN_ERROR:
      return {
        ...state,
        loginErrorMessage: action.payload
      }
    default:
      return state;
  }
}