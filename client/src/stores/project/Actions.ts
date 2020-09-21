import { ProjectActionTypes } from './Types';
// import { tigrowApi } from 'config';
// import {
//   tokenConfig,
//   // tokenConfigFIleUpload,
// } from 'stores/UtilsActions';
// import { isEqual } from 'lodash';
// import { CLEAR_ROOMS_REDUCER_STATE_FOR_CHANGE_PROJECT } from 'stores/room/Types';
import { IPendingProject } from './Reducer';
// import { Toaster } from '@blueprintjs/core';

export const getAllProjects = () => ({
  type: ProjectActionTypes.GET_ALL_PROJECTS_START
});

export const getAllProjectsSuccess = (response: any) => ({
  type: ProjectActionTypes.GET_ALL_PROJECTS_SUCCESS,
  payload: response,
});

export const getAllProjectsFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.GET_ALL_PROJECTS_FAILURE,
  payload: errorMessage,
});

// export const getAllProjects = () => async (
//   dispatch: any,
//   getState: any,
// ) => {
//   try {
//     const headers = tokenConfig();
//     const companyId = getState().companyReducer.currentCompany._id;
//     if ((headers as any).headers.Authorization) {
//       const response = await tigrowApi.get(
//         `projects/${companyId}/lists`,
//         headers,
//       );
//       dispatch({
//         type: PROJECT.PROJECT_GET_ALL_PROJECTS,
//         payload: response.data,
//       });
//       return response.data;
//     }
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       // tslint:disable-next-line: no-console
//       console.log('network error');
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log(error.response);
//       // return error.response;
//     }
//   }
// };

export const createProject = (payload: any) => ({
  type: ProjectActionTypes.CREATE_PROJECT_START,
  payload
});

export const createProjectSuccess = () => ({
  type: ProjectActionTypes.CREATE_PROJECT_SUCCESS,
});

export const createProjectFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.CREATE_PROJECT_FAILURE,
  payload: errorMessage,
});

// export const createProject = (payload: any) => async (
//   dispatch: any,
//   getState: any,
// ) => {
//   try {
//     const headers = tokenConfig();

//     if ((headers as any).headers.Authorization) {
//       const reqBody = {
//         name: payload.name,
//         companyId: payload.company,
//       };

//       const response = await tigrowApi.post(
//         `projects/${payload.company}/create-project`,
//         reqBody,
//         headers,
//       );
//       await dispatch({
//         type: PROJECT.PROJECT_CREATE,
//         payload: response.data,
//       });
//       dispatch(getAllProjects());
//       return response.data;
//     }
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       // tslint:disable-next-line: no-console
//       console.log('network error');
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log(error.response);
//       // return error.response;
//     }
//   }
// };

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

// export const createProjectInCompany = (payload: any) => async (
//   dispatch: any,
//   getState: any,
// ) => {
//   try {
//     const headers = tokenConfig();
//     const companyId = getState().companyReducer.currentCompany._id;
//     if ((headers as any).headers.Authorization) {
//       const reqBody = {
//         name: payload.name,
//         concernedAdmin: {
//           memberId: payload.admin.memberId,
//           accountId: payload.admin._id,
//         },
//         color: payload.color,
//         department: payload.department,
//         associates: payload.associates,
//         companyId: companyId,
//       };
//       const response = await tigrowApi.post(
//         `projects/${companyId}/create`,
//         reqBody,
//         headers,
//       );
//       await dispatch({
//         type: PROJECT.PROJECT_CREATE,
//         payload: response.data,
//       });
//       dispatch(getAllProjects());
//       return response.data;
//     }
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       // tslint:disable-next-line: no-console
//       // console.log('network error');
//     } else {
//       // tslint:disable-next-line: no-console
//       // console.log(error.response);
//       // return error.response;
//     }
//   }
// };

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

// export const archiveProject = (pid: string) => async (
//   dispatch: any,
//   getState: any,
// ) => {
//   try {
//     const headers = tokenConfig();
//     if ((headers as any).headers.Authorization) {
//       const response = await tigrowApi.put(
//         `projects/archive?pid=${pid}`,
//         null,
//         headers,
//       );
//       await dispatch({
//         type: PROJECT.PROJECT_ARCHIVE,
//         payload: response.data,
//       });
//       // dispatch({ type: PROJECT.PROJECT_GET_ALL_PROJECTS });
//       dispatch(getAllProjects());
//       return response.data;
//     }
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       // tslint:disable-next-line: no-console
//       console.log('network error');
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log(error.response);
//       // return error.response;
//     }
//   }
// };

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

// export const getProjectArchive = () => async (
//   dispatch: any,
//   getState: any,
// ) => {
//   try {
//     const headers = tokenConfig();
//     const companyId = getState().companyReducer.currentCompany._id;
//     if ((headers as any).headers.Authorization) {
//       const response = await tigrowApi.get(
//         `projects/${companyId}/archive-list`,
//         headers,
//       );
//       dispatch({
//         type: PROJECT.PROJECT_GET_ALL_ARCHIVE,
//         payload: response.data,
//       });
//       return response.data;
//     }
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       // tslint:disable-next-line: no-console
//       console.log('network error');
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log(error.response);
//       // return error.response;
//     }
//   }
// };

export const updateProjectName = (
  projectName: string,
  projectId: string
) => ({
  type: ProjectActionTypes.UPDATE_PROJECT_NAME_START,
  projectName,
  projectId,
  });

export const updateProjectNameSuccess = (response: any) => ({
  type: ProjectActionTypes.UPDATE_PROJECT_NAME_SUCCESS,
  payload: response,
});

export const updateProjectNameFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.UPDATE_PROJECT_NAME_FAILURE,
  payload: errorMessage,
});


// export const updateProjectName = (
//   projectName: string,
//   projectId: string,
// ) => async (dispatch: any) => {
//   try {
//     const headers = tokenConfig();
//     let response: any;
//     if ((headers as any).headers.Authorization) {
//       const reqBody = {
//         name: projectName,
//       };
//       response = await tigrowApi.put(
//         `projects/change-title?pid=${projectId}`,
//         reqBody,
//         headers,
//       );
//       await dispatch({
//         type: PROJECT.PROJECT_ARCHIVE,
//         payload: response.data,
//       });
//       // dispatch({ type: PROJECT.PROJECT_GET_ALL_PROJECTS });
//       dispatch(getAllProjects());
//     }
//     return response.status;
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       // tslint:disable-next-line: no-console
//       console.log('network error');
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log(error.response);
//       // return error.response;
//     }
//   }
// };

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

// export const getSingleProject = (pid: string) => async (
//   dispatch: any,
//   getState: any,
// ) => {
//   try {
//     const headers = tokenConfig();
//     if ((headers as any).headers.Authorization) {
//       const response = await tigrowApi.get(
//         `projects?pid=${pid}`,
//         headers,
//       );
//       await dispatch({
//         type: CLEAR_ROOMS_REDUCER_STATE_FOR_CHANGE_PROJECT,
//       });
//       await dispatch({
//         type: PROJECT.PROJECT_SINGLE_VIEW,
//         payload: response.data,
//       });
//       // tslint:disable-next-line: no-unused-expression
//       getState().projectReducer.projectDetails._id !== '' &&
//         dispatch({
//           type: PROJECT.PROJECT_FILE_OPEN,
//           payload: true,
//         });
//       return response.data;
//     }
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       // tslint:disable-next-line: no-console
//       console.log('network error');
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log(error.response);
//       // return error.response;
//     }
//   }
// };

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

export const projectPrefaceDescriptionUpdateFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.PROJECT_PREFACE_DES_UP_FAILURE,
  payload: errorMessage
});

// export const projectPrefaceDescriptionUpdate = (
//   pid: string,
//   description: string,
// ) => async (dispatch: any, getState: any) => {
//   try {
//     const headers = tokenConfig();
//     if ((headers as any).headers.Authorization) {
//       const reqBody = {
//         description,
//       };
//       const response = await tigrowApi.put(
//         `projects/description?pid=${pid}`,
//         reqBody,
//         headers,
//       );
//       dispatch({ type: PROJECT.PROJECT_PREFACE_DES_UP });
//       return response.data;
//     }
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       // tslint:disable-next-line: no-console
//       console.log('network error');
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log(error.response);
//       // return error.response;
//     }
//   }
// };

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

export const projectPrefaceOutlineUpdateFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.PROJECT_PREFACE_OUT_UP_FAILURE,
  payload: errorMessage,
});

// export const projectPrefaceOutlineUpdate = (
//   pid: string,
//   outline: string,
// ) => async (dispatch: any, getState: any) => {
//   try {
//     const headers = tokenConfig();
//     if ((headers as any).headers.Authorization) {
//       const reqBody = {
//         outline,
//       };
//       const response = await tigrowApi.put(
//         `projects/outline?pid=${pid}`,
//         reqBody,
//         headers,
//       );
//       dispatch({ type: PROJECT.PROJECT_PREFACE_OUT_UP });
//       return response.data;
//     }
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       // tslint:disable-next-line: no-console
//       console.log('network error');
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log(error.response);
//       // return error.response;
//     }
//   }
// };

export const setCurrentProjectId = (pid: string) => ({
  type: ProjectActionTypes.SET_CURRENT_PROJECT_ID,
  payload: pid,
});

// export const setCurrentProjectId = (pid: string) => async (
//   dispatch: any,
// ) => {
//   dispatch({ type: PROJECT.PROJECT_PROJECT_ID, payload: pid });
// };

export const projectFileUpload = (
  file: any,
  pid: string,
) => ({
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

// export const projectFileUpload: any = (
//   file: any,
//   pid: string,
// ) => async (dispatch: any, getState: any) => {
//   try {
//     const headers = tokenConfigFIleUpload();
//     if ((headers as any).headers.Authorization) {
//       const response = await tigrowApi.post(
//         `files/file-upload-project?pid=${pid}`,
//         file,
//         headers,
//       );
//       dispatch({ type: PROJECT.PROJECT_PREFACE_OUT_UP });
//       dispatch(
//         getSingleProject(
//           getState().projectReducer.projectDetails._id,
//         ),
//       );
//       return response.data;
//     }
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       // tslint:disable-next-line: no-console
//       console.log('network error');
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log(error.response);
//       // return error.response;
//     }
//   }
// };

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


// export const getAllPendingProjects = () => async (
//   dispatch: any,
//   getState: any,
// ) => {
//   try {
//     const headers = tokenConfig();

//     if ((headers as any).headers.Authorization) {
//       const companyId = getState().companyReducer.currentCompany._id;
//       const response = await tigrowApi.get(
//         `projects/${companyId}/pending-requests`,
//         headers,
//       );

//       dispatch({
//         type: PROJECT.PROJECT_GET_ALL_PENDING_PROJECT,
//         payload: response.data,
//       });
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log('error in selection of company fetching');
//     }
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       // tslint:disable-next-line: no-console
//       console.log('network error');
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log(error.response);
//       // return error.response;
//     }
//   }
// };

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

// export const acceptPendingProject = (
//   pending: IPendingProject,
// ) => async (dispatch: any, getState: any) => {
//   try {
//     const headers = tokenConfig();
//     if (
//       (headers as any).headers.Authorization &&
//       pending.project._id
//     ) {
//       const companyID = getState().companyReducer.currentCompany._id;
//       const pendingProjects = getState().projectReducer
//         .pendingProjects;
//       const reqBody = {
//         size: pending.size,
//         associate: pending.associate,
//       };
//       const response = await tigrowApi.put(
//         `projects/${companyID}/accept-request?pid=${pending.project._id}`,
//         reqBody,
//         headers,
//       );

//       if (response.status === 200) {
//         const currentPendingProjects = pendingProjects.filter(
//           (pending: IPendingProject) =>
//             isEqual(pending.project._id, pending.project._id) ===
//             false,
//         );
//         dispatch({
//           type: PROJECT.PROJECT_GET_ALL_PENDING_PROJECT,
//           payload: currentPendingProjects,
//         });
//         dispatch({
//           type: PROJECT.PROJECT_ADD_PROJECT,
//           payload: pending.project,
//         });
//         Toaster.create().show({
//           message: `Successfully accepted`,
//           timeout: 3000,
//           intent: 'success',
//         });
//       } else {
//         // tslint:disable-next-line: no-console
//         console.log(`Error in accept pending associate`);
//       }
//     }
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       // tslint:disable-next-line: no-console
//       console.log('network error');
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log(error.response);
//       // return error.response;
//     }
//   }
// };

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

// export const rejectPendingProject = (projectId: string) => async (
//   dispatch: any,
//   getState: any,
// ) => {
//   try {
//     const headers = tokenConfig();
//     if ((headers as any).headers.Authorization && projectId) {
//       const companyID = getState().companyReducer.currentCompany._id;
//       const pendingProjects = getState().projectReducer
//         .pendingProjects;
//       const response = await tigrowApi.put(
//         `projects/${companyID}/reject-request?pid=${projectId}`,
//         null,
//         headers,
//       );

//       if (response.status === 200) {
//         const currentPendingProjects = pendingProjects.filter(
//           (pending: IPendingProject) =>
//             isEqual(pending.project._id, projectId) === false,
//         );
//         dispatch({
//           type: PROJECT.PROJECT_GET_ALL_PENDING_PROJECT,
//           payload: currentPendingProjects,
//         });
//         Toaster.create().show({
//           message: `Successfully rejected`,
//           timeout: 3000,
//           intent: 'success',
//         });
//       } else {
//         // tslint:disable-next-line: no-console
//         console.log(`Error in accept pending associate`);
//       }
//     }
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       // tslint:disable-next-line: no-console
//       console.log('network error');
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log(error.response);
//       // return error.response;
//     }
//   }
// };

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

// export const updateProjectRole = (optionalRole: any) => async (
//   dispatch: any,
//   getState: any,
// ) => {
//   try {
//     const headers = tokenConfig();
//     const companyId = getState().companyReducer.currentCompany._id;
//     const projectId = getState().projectReducer.projectDetails._id;
//     if ((headers as any).headers.Authorization) {
//       const reqBody = {
//         optionalRole,
//       };
//       await tigrowApi.put(
//         `projects/${companyId}/role?pid=${projectId}`,
//         reqBody,
//         headers,
//       );
//       dispatch(getRoleForProject(projectId));
//       dispatch({
//         type: PROJECT.PROJECT_UPDATE_ROLE,
//       });
//     }
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       // tslint:disable-next-line: no-console
//       // console.log('network error');
//     } else {
//       // tslint:disable-next-line: no-console
//       // console.log(error.response);
//       // return error.response;
//     }
//   }
// };

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

// export const getRoleForProject = (projectId: string) => async (
//   dispatch: any,
//   getState: any,
// ) => {
//   try {
//     const headers = tokenConfig();
//     const userId = getState().userReducer.user._id;
//     if ((headers as any).headers.Authorization) {
//       const response = await tigrowApi.get(
//         `projects/individual/${userId}?pid=${projectId}`,
//         headers,
//       );
//       dispatch({
//         type: PROJECT.PROJECT_GET_ROLES,
//         payload: response.data,
//       });

//       return response.data;
//     }
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       // tslint:disable-next-line: no-console
//       console.log('network error');
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log(error.response);
//       // return error.response;
//     }
//   }
// };

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

// export const getProjectTeams = () => async (
//   dispatch: any,
//   getState: any,
// ) => {
//   try {
//     const headers = tokenConfig();
//     if ((headers as any).headers.Authorization) {
//       const pid = getState().projectReducer.pid;
//       const response = await tigrowApi.get(
//         `/teams/member-list?pid=${pid}`,
//         headers,
//       );
//       await dispatch({
//         type: PROJECT.PROJECT_GET_TEAMS,
//         payload: response.data.memberList,
//       });
//       return response.data;
//     }
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       // tslint:disable-next-line: no-console
//       console.log('network error');
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log(error.response);
//       // return error.response;
//     }
//   }
// };

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
  selectedTeamMember
});

export const addProjectTeamsSuccess = () => ({
  type: ProjectActionTypes.ADD_PROJECT_TEAMS_SUCCESS,
});

export const addProjectTeamsFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.ADD_PROJECT_TEAMS_FAILURE,
  payload: errorMessage,
});

// export const addProjectTeams = (
//   data: {
//     project: string;
//     company: string;
//     members: Array<{ account: string; member: string }>;
//   },
//   selectedTeamMember: {
//     _id: string;
//     email: string;
//     firstName: string;
//     lastName: string;
//     name: string;
//     memberId: string;
//   },
// ) => async (dispatch: any, getState: any) => {
//   try {
//     const headers = tokenConfig();
//     if ((headers as any).headers.Authorization) {
//       // tslint:disable-next-line: max-line-length
//       const response = await tigrowApi.post(
//         `/teams/${data.company}/add-team-member?pid=${data.project}`,
//         { members: data.members },
//         headers,
//       );
//       if (response.status === 201) {
//         dispatch(getProjectTeams());
//       }
//       return response;
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log('error in adding members in a room');
//     }
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       // tslint:disable-next-line: no-console
//       console.log(error.message);
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log(error.response);
//     }
//     return error.response;
//   }
// };

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

// export const getProjectAssociates = () => async (
//   dispatch: any,
//   getState: any,
// ) => {
//   try {
//     const headers = tokenConfig();
//     if ((headers as any).headers.Authorization) {
//       const pid = getState().projectReducer.pid;
//       const companyId = getState().companyReducer.currentCompany._id;
//       headers['companyid'] = companyId;
//       const response = await tigrowApi.get(
//         `/teams/associate-list?pid=${pid}`,
//         headers,
//       );

//       await dispatch({
//         type: PROJECT.PROJECT_GET_ASSOCIATES,
//         payload: response.data,
//       });
//       return response.data;
//     }
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       // tslint:disable-next-line: no-console
//       console.log('network error');
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log(error.response);
//       // return error.response;
//     }
//   }
// };

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

// export const addProjectAssociate = (
//   data: {
//     project: string;
//     company: String;
//     associates: Array<{ _id: string; size: number }>;
//   },
//   selectedAssociate: {
//     _id: string;
//     size: number;
//   },
// ) => async (dispatch: any) => {
//   try {
//     const headers = tokenConfig();
//     if ((headers as any).headers.Authorization) {
//       const response = await tigrowApi.put(
//         `/projects/${data.company}/add-associates?pid=${data.project}`,
//         {
//           associates: data.associates,
//         },
//         headers,
//       );
//       console.log(response);
//       if (response.status === 200) {
//         dispatch(getProjectAssociates());
//       }
//       // dispatch({ type: ADD_ASSOCIATE_IN_PENDING_LIST, payload: response.data });
//       return response;
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log('error in selection of company fetching');
//     }
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       // tslint:disable-next-line: no-console
//       console.log('network error');
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log(error.response);
//       return error.response;
//     }
//   }
// };

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

export const changeProjectMemberRoleFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.UPDATE_PROJECT_MEMBER_ROLE_FAILURE,
  payload: errorMessage,
});

// export const changeProjectMemberRole = (
//   values: { role: string },
//   memberId: string,
//   accountId: string,
// ) => async (dispatch: any, getState: any) => {
//   try {
//     const headers = tokenConfig();
//     if ((headers as any).headers.Authorization) {
//       const userId = getState().userReducer.user._id;
//       const projectId = getState().projectReducer.projectDetails._id;
//       const response = await tigrowApi.put(
//         `/teams/${memberId}/change-role?pid=${projectId}`,
//         values,
//         headers,
//       );
//       if (userId === accountId) {
//         dispatch(getRoleForProject(projectId));
//       }
//       dispatch(getSingleProject(projectId));
//       dispatch({
//         type: PROJECT.PROJECT_UPDATE_TEAM_ROLE,
//         payload: { memberId, role: values.role },
//       });
//       return response.status;
//     } else {
//       // tslint:disable-next-line: no-console
//       // console.log('error in changing team role');
//     }
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       // tslint:disable-next-line: no-console
//       // console.log('network error');
//     } else {
//       // tslint:disable-next-line: no-console
//       // console.log(error.response);
//     }
//     return error.response.status;
//   }
// };

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

// export const getProjectsIndividual = () => async (
//   dispatch: any,
//   getState: any,
// ) => {
//   try {
//     await dispatch({
//       type: PROJECT.PROJECT_LIST_CLEAR,
//     });
//     const headers = tokenConfig();
//     if ((headers as any).headers.Authorization) {
//       const list = getState().userReducer.user.companies;
//       list.map((l) => {
//         tigrowApi
//           .get(`projects/project-list/${l._id}`, headers)
//           .then((res) => {
//             res.data.map((m) => {
//               dispatch({
//                 type: PROJECT.PROJECT_LIST_INDIVIDUAL,
//                 payload: m.project,
//               });
//             });
//           })
//           .catch((err) => []);
//       });
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log('error in project fetching');
//     }
//   } catch (error) {
//     dispatch({
//       type: PROJECT.PROJECT_ERROR,
//       payload: error.response,
//     });
//   }
// };
