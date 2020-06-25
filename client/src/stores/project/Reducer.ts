import { PROJECT, CLEAR_PROJECT_REDUCER_STATE } from './Types';
import { Entity } from 'stores/UtilsActions';
import { User } from 'stores/user/Reducer';
import { IDesignations } from 'stores/company/Reducer';
import { ICompany } from 'stores/company/Reducer';

export interface IMember {
  concernedAdmin: {
    firstName: string;
    lastName: string;
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
  },
  teams: [],
  projectAssociates: [],
  pid: '',
  projectRole: {},
  projectFileOpen: false,
  projectList: [],
  error: ''
};

export const ProjectReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case PROJECT.PROJECT_GET_ALL_PROJECTS:
      return {
        ...state,
        allProjects: action.payload,
      };
    case PROJECT.PROJECT_GET_ALL_PENDING_PROJECT:
      return {
        ...state,
        pendingProjects: action.payload,
      };
    case PROJECT.PROJECT_GET_ALL_ARCHIVE:
      return {
        ...state,
        allArchive: action.payload,
      };
    case PROJECT.PROJECT_SINGLE_VIEW:
      return {
        ...state,
        projectDetails: {
          ...state.projectDetails,
          ...action.payload,
        },
      };
    case PROJECT.PROJECT_PROJECT_ID:
      return {
        ...state,
        pid: action.payload,
      };
    case CLEAR_PROJECT_REDUCER_STATE:
      return {
        ...initialState,
      };
    case PROJECT.PROJECT_ADD_PROJECT:
      return {
        ...state,
        allProjects: [...state.allProjects, action.payload],
      };
    case PROJECT.PROJECT_GET_TEAMS:
      return {
        ...state,
        teams: action.payload,
      };
    case PROJECT.PROJECT_GET_ASSOCIATES:
      return {
        ...state,
        projectAssociates: action.payload,
      };
    case PROJECT.PROJECT_GET_ROLES:
      return {
        ...state,
        projectRole: action.payload,
      };
    case PROJECT.PROJECT_UPDATE_TEAM_ROLE:
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
    case PROJECT.PROJECT_FILE_OPEN:
      return {
        ...state,
        projectFileOpen: action.payload,
      };
      case PROJECT.PROJECT_LIST_INDIVIDUAL:
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
    default:
      return state;
  }
};
