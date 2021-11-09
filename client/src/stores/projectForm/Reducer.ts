import { SAVE_PROJECT_FORM } from './Types';

export interface IProjectFormState {
  name: string;
  company: {
    value: string;
    label: string;
    isSubscribed: boolean;
  };
  deadline: any;
  currency?: {
    name: string;
    symbol: string;
  };
  budget?: string;
  label?: number;
  color?: string;
}

const InitialState = {
  data: {},
};

export const ProjectFormReducer = (
  state = InitialState,
  action: { payload: any; type: string },
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
          budget: action.payload.budget,
          currency: action.payload.currency,
        },
      };

    default:
      return state;
  }
};
