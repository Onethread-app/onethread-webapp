import { SAVE_REPORT_FORM } from './Types';

const InitialState = {
  data: {
    issueType: '',
    title: '',
    issueDetails: '',
    imageUrl: '',
  },
};

export const ReportFormReducer = (
  state = InitialState,
  action: any,
) => {
  switch (action.type) {
    case SAVE_REPORT_FORM:
      return {
        ...state,
        data: {
          issueType: action.payload.issueType,
          title: action.payload.title,
          issueDetails: action.payload.issueDetails,
          imageUrl: action.payload.imageUrl,
        },
      };

    default:
      return state;
  }
};
