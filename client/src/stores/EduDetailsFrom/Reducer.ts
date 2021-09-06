import { SAVE_EDU_DETAILS_FORM } from './Types';

const InitialState = {
  data: {},
};

export const EduDetailsFormReducer = (
  state = InitialState,
  action: any,
) => {
  switch (action.type) {
    case SAVE_EDU_DETAILS_FORM:
      return {
        ...state,
        data: {
          degree: action.payload.degree,
          institutionName: action.payload.institutionName,
          startYear: action.payload.startYear,
          endingYear: action.payload.endingYear,
          eduDescription: action.payload.eduDescription,
          currentlyStudy: action.payload.currentlyStudy,
        },
      };

    default:
      return state;
  }
};
