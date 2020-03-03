import { PROJECT } from './Types';

const initialState = {
  name: '',
  id: '',
  departments: [],
  color: 0
};

export const ProjectReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case PROJECT.PROJECT_GET_ALL_PROJECTS:
      return {
        ...state,
        name: action.payload.name,
        id: action.payload._id,
        departments: action.payload.departments,
        color: action.payload.color
      };
    default:
      return state;
  }
};