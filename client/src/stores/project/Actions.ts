import { ProjectActionTypes } from './Types';
import { IPendingProject } from './Reducer';

export const getAllProjects = () => ({
  type: ProjectActionTypes.GET_ALL_PROJECTS_START,
});

export const getAllProjectsSuccess = (response: any) => ({
  type: ProjectActionTypes.GET_ALL_PROJECTS_SUCCESS,
  payload: response,
});

export const getAllProjectsFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.GET_ALL_PROJECTS_FAILURE,
  payload: errorMessage,
});

export const createProject = (payload: any) => ({
  type: ProjectActionTypes.CREATE_PROJECT_START,
  payload,
});

export const createProjectSuccess = () => ({
  type: ProjectActionTypes.CREATE_PROJECT_SUCCESS,
});

export const createProjectFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.CREATE_PROJECT_FAILURE,
  payload: errorMessage,
});

export const createProjectInCompany = (payload: any) => ({
  type: ProjectActionTypes.CREATE_PROJECT_IN_COMPANY_START,
  payload,
});

export const createProjectInCompanySuccess = () => ({
  type: ProjectActionTypes.CREATE_PROJECT_IN_COMPANY_SUCCESS,
});

export const createProjectInCompanyFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.CREATE_PROJECT_IN_COMPANY_FAILURE,
  payload: errorMessage,
});

export const archiveProject = (pid: string) => ({
  type: ProjectActionTypes.ARCHIVE_PROJECT_START,
  payload: pid,
});

export const archiveProjectSuccess = () => ({
  type: ProjectActionTypes.ARCHIVE_PROJECT_SUCCESS,
});

export const archiveProjectFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.ARCHIVE_PROJECT_FAILURE,
  payload: errorMessage,
});

export const unarchiveProject = (pid: string) => ({
  type: ProjectActionTypes.UNARCHIVE_PROJECT_START,
  payload: pid,
});

export const unarchiveProjectSuccess = (response: any) => ({
  type: ProjectActionTypes.UNARCHIVE_PROJECT_SUCCESS,
  payload: response,
});

export const unarchiveProjectFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.UNARCHIVE_PROJECT_FAILURE,
  payload: errorMessage,
});

export const deleteProject = (pid: string) => ({
  type: ProjectActionTypes.DELETE_PROJECT_START,
  payload: pid,
});

export const deleteProjectSuccess = (response: any) => ({
  type: ProjectActionTypes.DELETE_PROJECT_SUCCESS,
  payload: response,
});

export const deleteProjectFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.DELETE_PROJECT_FAILURE,
  payload: errorMessage,
});

export const getProjectArchive = () => ({
  type: ProjectActionTypes.GET_ARCHIVED_PROJECTS_START,
});

export const getProjectArchiveSuccess = (response: any) => ({
  type: ProjectActionTypes.GET_ARCHIVED_PROJECTS_SUCCESS,
  payload: response,
});

export const getProjectArchiveFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.GET_ARCHIVED_PROJECTS_FAILURE,
  payload: errorMessage,
});

export const updateProject = (
  projectName: string,
  projectId: string,
  color: string,
  deadline: Date,
) => ({
  type: ProjectActionTypes.UPDATE_PROJECT_START,
  projectName,
  projectId,
  color,
  deadline,
});

export const updateProjectSuccess = (response: any) => ({
  type: ProjectActionTypes.UPDATE_PROJECT_SUCCESS,
  payload: response,
});

export const updateProjectFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.UPDATE_PROJECT_FAILURE,
  payload: errorMessage,
});

export const getSingleProject = (pid: string) => ({
  type: ProjectActionTypes.GET_SINGLE_PROJECT_START,
  payload: pid,
});

export const getSingleProjectSuccess = (response: any) => ({
  type: ProjectActionTypes.GET_SINGLE_PROJECT_SUCCESS,
  payload: response,
});

export const getSingleProjectFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.GET_SINGLE_PROJECT_FAILURE,
  payload: errorMessage,
});

export const openProjectFIle = (payload: boolean) => ({
  type: ProjectActionTypes.OPEN_PROJECT_FILE,
  payload,
});

export const projectPrefaceDescriptionUpdate = (
  pid: string,
  description: string,
) => ({
  type: ProjectActionTypes.PROJECT_PREFACE_DES_UP_START,
  pid,
  description,
});

export const projectPrefaceDescriptionUpdateSuccess = () => ({
  type: ProjectActionTypes.PROJECT_PREFACE_DES_UP_SUCCESS,
});

export const projectPrefaceDescriptionUpdateFailure = (
  errorMessage: any,
) => ({
  type: ProjectActionTypes.PROJECT_PREFACE_DES_UP_FAILURE,
  payload: errorMessage,
});

export const projectPrefaceOutlineUpdate = (
  pid: string,
  outline: string,
) => ({
  type: ProjectActionTypes.PROJECT_PREFACE_OUT_UP_START,
  pid,
  outline,
});

export const projectPrefaceOutlineUpdateSuccess = () => ({
  type: ProjectActionTypes.PROJECT_PREFACE_OUT_UP_SUCCESS,
});

export const projectPrefaceOutlineUpdateFailure = (
  errorMessage: any,
) => ({
  type: ProjectActionTypes.PROJECT_PREFACE_OUT_UP_FAILURE,
  payload: errorMessage,
});

export const setCurrentProjectId = (pid: string) => ({
  type: ProjectActionTypes.SET_CURRENT_PROJECT_ID,
  payload: pid,
});

export const projectFileUpload = (file: any, pid: string) => ({
  type: ProjectActionTypes.PROJECT_FILE_UP_START,
  file,
  pid,
});

export const projectFileUploadSuccess = () => ({
  type: ProjectActionTypes.PROJECT_FILE_UP_SUCCESS,
});

export const projectFileUploadFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.PROJECT_FILE_UP_FAILURE,
  payload: errorMessage,
});

export const getAllPendingProjects = () => ({
  type: ProjectActionTypes.GET_ALL_PENDING_PROJECT_START,
});

export const getAllPendingProjectsSuccess = (response: any) => ({
  type: ProjectActionTypes.GET_ALL_PENDING_PROJECT_SUCCESS,
  payload: response,
});

export const getAllPendingProjectsFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.GET_ALL_PENDING_PROJECT_FAILURE,
  payload: errorMessage,
});

export const acceptPendingProject = (pending: IPendingProject) => ({
  type: ProjectActionTypes.ACCEPT_PENDING_PROJECT_START,
  pending,
});

export const acceptPendingProjectSuccess = () => ({
  type: ProjectActionTypes.ACCEPT_PENDING_PROJECT_SUCCESS,
});

export const acceptPendingProjectFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.ACCEPT_PENDING_PROJECT_FAILURE,
  payload: errorMessage,
});

export const addProject = (project: any) => ({
  type: ProjectActionTypes.ADD_PROJECT,
  payload: project,
});

export const rejectPendingProject = (projectId: string) => ({
  type: ProjectActionTypes.REJECT_PENDING_PROJECT_START,
  projectId,
});

export const rejectPendingProjectSuccess = () => ({
  type: ProjectActionTypes.REJECT_PENDING_PROJECT_SUCCESS,
});

export const rejectPendingProjectFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.REJECT_PENDING_PROJECT_FAILURE,
  payload: errorMessage,
});

export const updateProjectRole = (optionalRole: any) => ({
  type: ProjectActionTypes.UPDATE_PROJECT_ROLE_START,
  optionalRole,
});

export const updateProjectRoleSuccess = () => ({
  type: ProjectActionTypes.UPDATE_PROJECT_ROLE_SUCCESS,
});

export const updateProjectRoleFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.UPDATE_PROJECT_ROLE_FAILURE,
  payload: errorMessage,
});

export const getRoleForProject = (projectId: string) => ({
  type: ProjectActionTypes.GET_PROJECT_ROLE_START,
  projectId,
});

export const getRoleForProjectSuccess = (response: any) => ({
  type: ProjectActionTypes.GET_PROJECT_ROLE_SUCCESS,
  payload: response,
});

export const getRoleForProjectFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.GET_PROJECT_ROLE_FAILURE,
  payload: errorMessage,
});

export const getProjectTeams = () => ({
  type: ProjectActionTypes.GET_PROJECT_TEAMS_START,
});

export const getProjectTeamsSuccess = (response: any) => ({
  type: ProjectActionTypes.GET_PROJECT_TEAMS_SUCCESS,
  payload: response,
});

export const getProjectTeamsFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.GET_PROJECT_TEAMS_FAILURE,
  payload: errorMessage,
});

export const addProjectTeams = (
  data: {
    project: string;
    company: string;
    members: Array<{ account: string; member: string }>;
  },
  selectedTeamMember: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    name: string;
    memberId: string;
  },
) => ({
  type: ProjectActionTypes.ADD_PROJECT_TEAMS_START,
  data,
  selectedTeamMember,
});

export const addProjectTeamsSuccess = () => ({
  type: ProjectActionTypes.ADD_PROJECT_TEAMS_SUCCESS,
});

export const addProjectTeamsFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.ADD_PROJECT_TEAMS_FAILURE,
  payload: errorMessage,
});

export const getProjectAssociates = () => ({
  type: ProjectActionTypes.GET_PROJECT_ASSOCIATES_START,
});

export const getProjectAssociatesSuccess = (response: any) => ({
  type: ProjectActionTypes.GET_PROJECT_ASSOCIATES_SUCCESS,
  payload: response,
});

export const getProjectAssociatesFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.GET_PROJECT_ASSOCIATES_FAILURE,
  payload: errorMessage,
});

export const addProjectAssociate = (
  data: {
    project: string;
    company: String;
    associates: Array<{ _id: string; size: number }>;
  },
  selectedAssociate: {
    _id: string;
    size: number;
  },
) => ({
  type: ProjectActionTypes.ADD_PROJECT_ASSOCIATES_START,
  data,
  selectedAssociate,
});

export const addProjectAssociateSuccess = () => ({
  type: ProjectActionTypes.ADD_PROJECT_ASSOCIATES_SUCCESS,
});

export const addProjectAssociateFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.ADD_PROJECT_ASSOCIATES_FAILURE,
  payload: errorMessage,
});

export const changeProjectMemberRole = (
  values: { role: string },
  memberId: string,
  accountId: string,
) => ({
  type: ProjectActionTypes.UPDATE_PROJECT_MEMBER_ROLE_START,
  values,
  memberId,
  accountId,
});

export const changeProjectMemberRoleSuccess = (response: any) => ({
  type: ProjectActionTypes.UPDATE_PROJECT_MEMBER_ROLE_SUCCESS,
  payload: response,
});

export const changeProjectMemberRoleFailure = (
  errorMessage: any,
) => ({
  type: ProjectActionTypes.UPDATE_PROJECT_MEMBER_ROLE_FAILURE,
  payload: errorMessage,
});

export const getProjectsIndividual = () => ({
  type: ProjectActionTypes.GET_INDIVIDUAL_PROJECT_LIST_START,
});

export const getProjectsIndividualSuccess = (response: any) => ({
  type: ProjectActionTypes.GET_INDIVIDUAL_PROJECT_LIST_SUCCESS,
  payload: response,
});

export const getProjectsIndividualFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.GET_INDIVIDUAL_PROJECT_LIST_FAILURE,
  payload: errorMessage,
});

export const setProjectAccessForUser = (response: boolean) => ({
  type: ProjectActionTypes.SET_USER_ACCESS,
  payload: response,
});

export const clearProjectReducer = () => ({
  type: ProjectActionTypes.CLEAR_PROJECT_REDUCER,
});

export const updateProjectLoading = (loading: boolean) => ({
  type: ProjectActionTypes.UPDATE_PROJECT_LOADING,
  payload: loading,
});

export const updateProjectTimeSpent = (payload: any) => ({
  type: ProjectActionTypes.UPDATE_PROJECT_TIME_SPENT,
  payload,
});

export const deleteTeamMember = (teamId: string) => ({
  type: ProjectActionTypes.DELETE_TEAM_MEMBER_START,
  payload: teamId,
});
