import { SAVE_PROJECT_FORM } from './Types';

const InitialState = {
  data: {},
};

export const ProjectFormReducer = (
  state = InitialState,
  action: any,
) => {
  switch (action.type) {
    case SAVE_PROJECT_FORM:
      return {
        ...state,
        data: {
          name: action.payload.name,
          deadline: action.payload.deadline,
          color: action.payload.color,
          company: action.payload.company,
          value: action.payload.value,
          label: action.payload.label,
        },
      };

    default:
      return state;
  }
};
