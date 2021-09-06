import { SAVE_USER_BASIC_INFO_FORM } from './Types';

const InitialState = {
  data: {},
};

export const UserBasicInfoFormReducer = (
  state = InitialState,
  action: any,
) => {
  switch (action.type) {
    case SAVE_USER_BASIC_INFO_FORM:
      return {
        ...state,
        data: {
          secondaryEmail: action.payload.secondaryEmail,
          location: action.payload.location,
          gender: action.payload.gender,
          birthDate: action.payload.birthDate,
          bloodGroup: action.payload.bloodGroup,
        },
      };

    default:
      return state;
  }
};
