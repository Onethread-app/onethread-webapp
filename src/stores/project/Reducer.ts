import { PROJECT } from './Types';

const initialState = {
  allProjects: [],
  allArchive: [],
  projectDetails: {
    color: 0,
    files: [],
    _id: '',
    name: '',
    description: '',
    outline: ''
  }
};

export const ProjectReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case PROJECT.PROJECT_GET_ALL_PROJECTS:
      return {
        ...state,
        allProjects: action.payload
      };
    case PROJECT.PROJECT_GET_ALL_ARCHIVE:
      return {
        ...state,
        allArchive: action.payload
      };
    case PROJECT.PROJECT_SINGLE_VIEW:
      return {
         ...state,
         projectDetails: action.payload 
      }
    default:
      return state;
  }
};