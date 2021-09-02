import { SAVE_TASK_FORM } from './Types';

const InitialState = {
  data: {},
};

export const TaskFormReducer = (
  state = InitialState,
  action: any,
) => {
  switch (action.type) {
    case SAVE_TASK_FORM:
      return {
        ...state,
        data: {
          name: action.payload.name,
          assignmembers: action.payload.assignmembers,
          dueDate: action.payload.dueDate,
          priority: action.payload.priority,
          description: action.payload.description,
          memberValue: action.payload.memberValue,
        },
      };

    default:
      return state;
  }
};
