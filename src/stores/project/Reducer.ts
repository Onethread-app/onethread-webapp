import { PROJECT, CLEAR_PROJECT_REDUCER_STATE } from './Types';
import { Entity } from 'stores/UtilsActions';
import { User } from 'stores/user/Reducer';
import { IDesignations } from 'stores/company/Reducer';

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

export interface IProjectTeam {
  _id: string;
  role: string;
  member: {
    _id: string;
    account: {
      _id: string;
      name: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    designations: [IDesignations];
  };
  project: {
    _id: string;
    company: string;
    associate: any[];
  };
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
  teams: [],
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
        projectDetails: { ...state.projectDetails, ...action.payload }
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
    case PROJECT.PROJECT_GET_TEAMS:
      return {
        ...state,
        teams: action.payload
      };
    default:
      return state;
  }
};
