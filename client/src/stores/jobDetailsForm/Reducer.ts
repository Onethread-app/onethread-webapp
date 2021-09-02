import { SAVE_JOB_DETAILS_FORM } from './Types';

const InitialState = {
  data: {},
};

export const JobDetailsFormReducer = (
  state = InitialState,
  action: any,
) => {
  switch (action.type) {
    case SAVE_JOB_DETAILS_FORM:
      return {
        ...state,
        data: {
          companyName: action.payload.companyName,
          positionName: action.payload.positionName,
          startYear: action.payload.startYear,
          endingYear: action.payload.endingYear,
          currentlyWork: action.payload.currentlyWork,
          jobDescription: action.payload.jobDescription,
        },
      };

    default:
      return state;
  }
};
