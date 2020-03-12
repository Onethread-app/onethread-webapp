import { PROJECT } from './Types';
import { Entity } from 'stores/UtilsActions';

export interface Project {
  _id: string;
  name: string;
  color: number;
  description: string;
  outline: string;
  files: any;
  departments: Entity[];
  totalMember: number;
}

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
  },
  pid: ''
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
      };
    case PROJECT.PROJECT_PROJECT_ID:
      return {
        ...state,
        pid: action.payload
      };
    default:
      return state;
  }
};