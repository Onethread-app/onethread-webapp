import {
  PROJECT,
  CLEAR_PROJECT_REDUCER_STATE,
  ProjectActionTypes,
} from './Types';
import { Entity } from 'stores/UtilsActions';
import { User } from 'stores/user/Reducer';
import { IDesignations } from 'stores/company/Reducer';
import { ICompany } from 'stores/company/Reducer';

export interface IMember {
  concernedAdmin: {
    firstName: string;
    lastName: string;
    name: string;
    _id: string;
  };
  name: string;
  optionalRole: [];
  type: string;
  _id: string;
}
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
  createdAt: Date;
  status: String;
}

export interface IPendingProject {
  _id: string;
  project: IProject;
  size: string;
  company: ICompany;
  associate: string;
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
    outline: '',
    status: '',
  },
  hasAccess: true,
  teams: [],
  projectAssociates: [],
  pid: '',
  projectRole: {},
  projectFileOpen: false,
  projectList: [],
  projectLoading: false,
  gettingAllProjects: false,
  singleProjectLoading: false,
  addTeamMemberLoading: false,
  unarchivingProject: false,
  updatingProject: false,
  deletingProject: false,
  error: '',
  errorOnGettingAllProjects: '',
  errorOnUnarchive: '',
  errorOnUpdatingProject: '',
  errorOnSingleProjectLoading: '',
  errorOnDeletingProject: '',
};

export const ProjectReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ProjectActionTypes.GET_INDIVIDUAL_PROJECT_LIST_START:
    case ProjectActionTypes.UPDATE_PROJECT_MEMBER_ROLE_START:
    case ProjectActionTypes.ADD_PROJECT_ASSOCIATES_START:
    case ProjectActionTypes.GET_PROJECT_ASSOCIATES_START:
    case ProjectActionTypes.GET_PROJECT_TEAMS_START:
    case ProjectActionTypes.GET_PROJECT_ROLE_START:
    case ProjectActionTypes.UPDATE_PROJECT_ROLE_START:
    case ProjectActionTypes.REJECT_PENDING_PROJECT_START:
    case ProjectActionTypes.ACCEPT_PENDING_PROJECT_START:
    case ProjectActionTypes.GET_ARCHIVED_PROJECTS_START:
    case ProjectActionTypes.GET_ALL_PENDING_PROJECT_START:
    case ProjectActionTypes.PROJECT_FILE_UP_START:
    case ProjectActionTypes.PROJECT_PREFACE_OUT_UP_START:
    case ProjectActionTypes.PROJECT_PREFACE_DES_UP_START:
    case ProjectActionTypes.ARCHIVE_PROJECT_START:
    case ProjectActionTypes.CREATE_PROJECT_IN_COMPANY_START:
    case ProjectActionTypes.CREATE_PROJECT_START:
      return {
        ...state,
        projectLoading: true,
      };
    case ProjectActionTypes.ADD_PROJECT_ASSOCIATES_SUCCESS:
    case ProjectActionTypes.UPDATE_PROJECT_ROLE_SUCCESS:
    case ProjectActionTypes.REJECT_PENDING_PROJECT_SUCCESS:
    case ProjectActionTypes.ACCEPT_PENDING_PROJECT_SUCCESS:
    case ProjectActionTypes.PROJECT_FILE_UP_SUCCESS:
    case ProjectActionTypes.PROJECT_PREFACE_OUT_UP_SUCCESS:
    case ProjectActionTypes.PROJECT_PREFACE_DES_UP_SUCCESS:
    case ProjectActionTypes.ARCHIVE_PROJECT_SUCCESS:
    case ProjectActionTypes.CREATE_PROJECT_IN_COMPANY_SUCCESS:
    case ProjectActionTypes.CREATE_PROJECT_SUCCESS:
      return {
        ...state,
        projectLoading: false,
      };
    case ProjectActionTypes.GET_INDIVIDUAL_PROJECT_LIST_FAILURE:
    case ProjectActionTypes.UPDATE_PROJECT_MEMBER_ROLE_FAILURE:
    case ProjectActionTypes.ADD_PROJECT_ASSOCIATES_FAILURE:
    case ProjectActionTypes.GET_PROJECT_ASSOCIATES_FAILURE:
    case ProjectActionTypes.GET_PROJECT_TEAMS_FAILURE:
    case ProjectActionTypes.GET_PROJECT_ROLE_FAILURE:
    case ProjectActionTypes.UPDATE_PROJECT_ROLE_FAILURE:
    case ProjectActionTypes.REJECT_PENDING_PROJECT_FAILURE:
    case ProjectActionTypes.ACCEPT_PENDING_PROJECT_FAILURE:
    case ProjectActionTypes.GET_ARCHIVED_PROJECTS_FAILURE:
    case ProjectActionTypes.GET_ALL_PENDING_PROJECT_FAILURE:
    case ProjectActionTypes.PROJECT_FILE_UP_FAILURE:
    case ProjectActionTypes.PROJECT_PREFACE_OUT_UP_FAILURE:
    case ProjectActionTypes.PROJECT_PREFACE_DES_UP_FAILURE:
    case ProjectActionTypes.ARCHIVE_PROJECT_FAILURE:
    case ProjectActionTypes.CREATE_PROJECT_IN_COMPANY_FAILURE:
    case ProjectActionTypes.CREATE_PROJECT_FAILURE:
      return {
        ...state,
        error: action.payload,
        projectLoading: false,
      };
    case ProjectActionTypes.UPDATE_PROJECT_START:
      return {
        ...state,
        updatingProject: true,
        errorOnUpdatingProject: '',
      };
    case ProjectActionTypes.UPDATE_PROJECT_SUCCESS:
      return {
        ...state,
        updatingProject: false,
      };
    case ProjectActionTypes.UPDATE_PROJECT_FAILURE:
      return {
        ...state,
        updatingProject: false,
        errorOnUpdatingProject: action.payload,
      };
    case ProjectActionTypes.UNARCHIVE_PROJECT_START:
      return {
        ...state,
        unarchivingProject: true,
        errorOnUnarchive: '',
      };
    case ProjectActionTypes.UNARCHIVE_PROJECT_SUCCESS:
      return {
        ...state,
        unarchivingProject: false,
      };
    case ProjectActionTypes.UNARCHIVE_PROJECT_FAILURE:
      return {
        ...state,
        unarchivingProject: false,
        errorOnUnarchive: action.payload,
      };
    case ProjectActionTypes.DELETE_PROJECT_START:
      return {
        ...state,
        deletingProject: true,
        errorOnDeletingProject: '',
      };
    case ProjectActionTypes.DELETE_PROJECT_SUCCESS:
      // console.log(
      //   action.payload,
      //   state.allArchive.filter(
      //     (arch: any) => arch._id !== String(action.paylaod),
      //   ),
      // );
      return {
        ...state,
        allArchive: state.allArchive.filter(
          (arch: any) => arch._id !== String(action.paylaod),
        ),
        deletingProject: false,
      };
    case ProjectActionTypes.DELETE_PROJECT_FAILURE:
      return {
        ...state,
        errorOnDeletingProject: action.payload,
        deletingProject: false,
      };
    case ProjectActionTypes.ADD_PROJECT_TEAMS_START:
      return {
        ...state,
        addTeamMemberLoading: true,
      };
    case ProjectActionTypes.ADD_PROJECT_TEAMS_SUCCESS:
    case ProjectActionTypes.ADD_PROJECT_TEAMS_FAILURE:
      return {
        ...state,
        addTeamMemberLoading: false,
      };
    case ProjectActionTypes.GET_ALL_PROJECTS_START:
      return {
        ...state,
        errorOnGettingAllProjects: '',
        gettingAllProjects: true,
      };
    case ProjectActionTypes.GET_ALL_PROJECTS_SUCCESS:
      return {
        ...state,
        allProjects: action.payload,
        gettingAllProjects: false,
      };
    case ProjectActionTypes.GET_ALL_PROJECTS_FAILURE:
      return {
        ...state,
        errorOnGettingAllProjects: action.payload,
        gettingAllProjects: false,
      };
    case ProjectActionTypes.GET_ARCHIVED_PROJECTS_SUCCESS:
      return {
        ...state,
        allArchive: action.payload,
        projectLoading: false,
      };
    case ProjectActionTypes.GET_ALL_PENDING_PROJECT_SUCCESS:
      return {
        ...state,
        pendingProjects: action.payload,
        projectLoading: false,
      };
    case ProjectActionTypes.GET_SINGLE_PROJECT_START:
      return {
        ...state,
        singleProjectLoading: true,
        errorOnSingleProjectLoading: '',
      };
    case ProjectActionTypes.GET_SINGLE_PROJECT_SUCCESS:
      return {
        ...state,
        projectDetails: {
          ...action.payload,
        },
        singleProjectLoading: false,
        errorOnSingleProjectLoading: '',
      };
    case ProjectActionTypes.GET_SINGLE_PROJECT_FAILURE:
      return {
        ...state,
        errorOnSingleProjectLoading: action.payload,
        singleProjectLoading: false,
      };
    case ProjectActionTypes.ADD_PROJECT:
      return {
        ...state,
        allProjects: [...state.allProjects, action.payload],
      };
    case ProjectActionTypes.GET_PROJECT_TEAMS_SUCCESS:
      return {
        ...state,
        teams: action.payload,
      };
    case ProjectActionTypes.GET_PROJECT_ASSOCIATES_SUCCESS:
      return {
        ...state,
        projectAssociates: action.payload,
      };
    case ProjectActionTypes.GET_PROJECT_ROLE_SUCCESS:
      return {
        ...state,
        projectRole: action.payload,
      };
    case ProjectActionTypes.UPDATE_PROJECT_MEMBER_ROLE_SUCCESS:
      return {
        ...state,
        teams: state.teams.map((team: IProjectTeam) => {
          if (action.payload.memberId === team.member._id) {
            return {
              ...team,
              role: action.payload.role,
            };
          } else {
            return team;
          }
        }),
      };
    case ProjectActionTypes.OPEN_PROJECT_FILE:
      return {
        ...state,
        projectFileOpen: action.payload,
      };
    case ProjectActionTypes.SET_CURRENT_PROJECT_ID:
      return {
        ...state,
        pid: action.payload,
      };
    case PROJECT.PROJECT_FILE_OPEN:
      return {
        ...state,
        projectFileOpen: action.payload,
      };
    case ProjectActionTypes.GET_INDIVIDUAL_PROJECT_LIST_SUCCESS:
      return {
        ...state,
        projectList: [...state.projectList, action.payload],
      };
    case PROJECT.PROJECT_LIST_CLEAR:
      return {
        ...state,
        projectList: [],
      };
    case PROJECT.PROJECT_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_PROJECT_REDUCER_STATE:
      return {
        ...initialState,
      };
    case ProjectActionTypes.SET_USER_ACCESS:
      return {
        ...state,
        hasAccess: action.payload,
      };
    default:
      return state;
  }
};
