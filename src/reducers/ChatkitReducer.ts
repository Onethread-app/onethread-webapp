import { CHATKIT_USER_LOADING, GET_CHATKIT_USER, GET_CHATKIT_USER_ERROR } from 'actions/Types';

const InitialState = {
  user: {},
  error: null,
  loading: false,
}

export const ChatkitReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case CHATKIT_USER_LOADING:
      return {
        ...state,
        loading: true
      }
    case GET_CHATKIT_USER:
      return {
        ...state,
        user: action.payload,
        error:null,
        loading: false
      }
    case GET_CHATKIT_USER_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    default:
      return state;
  }
}