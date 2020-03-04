import { PROJECT } from './Types';

const initialState = {
  allProjects: []
};

export const ProjectReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case PROJECT.PROJECT_GET_ALL_PROJECTS:
      return {
        ...state,
        allProjects: action.payload
      };
    default:
      return state;
  }
};