import { NEW_USER } from 'actions/Types';

// interface ResponseUserProps {
//   loading: boolean;
//   user: {
//     token: string
//     firstName: string;
//     lastName: string;
//   }
// }

const InitialState = {
  newUser: {}
}

export const AuthReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case NEW_USER:
      return {
        ...state,
        newUser: action.payload
      }
    default:
      return state;
  }
}