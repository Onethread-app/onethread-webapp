import { PROJECT, CLEAR_PROJECT_REDUCER_STATE } from './Types';
import { Entity } from 'stores/UtilsActions';
import { User } from 'stores/user/Reducer';

export interface IProject {
  _id: string;
  name: string;
  color: number;
  description: string;
  outline: string;
  files: any;
  departments: Entity[];
  totalMember: number;
  concernAdmin: User;
}

export interface IPendingProject {
  _id: string;
  project: IProject;
}

export interface ProjectModel {
  pendingProjects: IProject[];
  allProjects: IProject[];
  allArchive: IProject[];
  projectDetails: IProject;
}

const initialState = {
  allProjects: [],
  allArchive: [],
  pendingProjects: [],
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
    case PROJECT.PROJECT_GET_ALL_PENDING_PROJECT:
      return {
        ...state,
        pendingProjects: action.payload
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
    case CLEAR_PROJECT_REDUCER_STATE:
      return {
        ...initialState
      };
    case PROJECT.PROJECT_ADD_PROJECT:
      return {
        ...state,
        allProjects: [...state.allProjects, action.payload]
      };
    default:
      return state;
  }
};
