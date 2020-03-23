import { PROJECT } from './Types';
import { tigrowApi } from 'config';
import { tokenConfig, tokenConfigFIleUpload } from 'stores/UtilsActions';
import { isEqual } from 'lodash';
import { CLEAR_ROOMS_REDUCER_STATE_FOR_CHANGE_PROJECT } from 'stores/room/Types';
import { IPendingProject, IProject } from './Reducer';
import { Toaster } from '@blueprintjs/core';

export const getAllProjects = () => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    const companyId = getState().companyReducer.currentCompany._id;
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.get(
        `projects/${companyId}/lists`,
        headers
      );
      dispatch({
        type: PROJECT.PROJECT_GET_ALL_PROJECTS,
        payload: response.data
      });
      return response.data;
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      // return error.response;
    }
  }
};

export const createProject = (payload: any, admin: any) => async (
  dispatch: any,
  getState: any
) => {
  try {
    const headers = tokenConfig();
    const companyId = getState().companyReducer.currentCompany._id;
    const userId = getState().userReducer.user._id;

    if ((headers as any).headers.Authorization) {
      const reqBody = {
        name: payload.name,
        type: payload.projectType,
        account: userId,
        concernedAdmin: {
          memberId: admin.memberId,
          accountId: admin._id,
        },
        companyId,
        departments: payload.department,
        associates: payload.associates,
        color: payload.color
      };

      const response = await tigrowApi.post(
        `projects/${companyId}/create`,
        reqBody,
        headers
      );
      await dispatch({ type: PROJECT.PROJECT_CREATE, payload: response.data });
      dispatch(getAllProjects());
      return response.data;
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      // return error.response;
    }
  }
};

export const archiveProject = (pid: string) => async (
  dispatch: any,
  getState: any
) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.put(
        `projects/archive?pid=${pid}`,
        null,
        headers
      );
      await dispatch({ type: PROJECT.PROJECT_ARCHIVE, payload: response.data });
      // dispatch({ type: PROJECT.PROJECT_GET_ALL_PROJECTS });
      dispatch(getAllProjects());
      return response.data;
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      // return error.response;
    }
  }
};

export const getProjectArchive = () => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    const companyId = getState().companyReducer.currentCompany._id;
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.get(
        `projects/${companyId}/archive-list`,
        headers
      );
      dispatch({
        type: PROJECT.PROJECT_GET_ALL_ARCHIVE,
        payload: response.data
      });
      return response.data;
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      // return error.response;
    }
  }
};

export const updateProjectName = (
  projectName: string,
  projectId: string
) => async (dispatch: any) => {
  try {
    const headers = tokenConfig();
    let response: any;
    if ((headers as any).headers.Authorization) {
      const reqBody = {
        name: projectName,
        pid: projectId
      };
      response = await tigrowApi.put(`projects/change-title`, reqBody, headers);
      await dispatch({ type: PROJECT.PROJECT_ARCHIVE, payload: response.data });
      // dispatch({ type: PROJECT.PROJECT_GET_ALL_PROJECTS });
      dispatch(getAllProjects());
    }
    return response.status;
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      // return error.response;
    }
  }
};

export const getSingleProject = (pid: string) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const accountId = getState().userReducer.user._id;
      const response = await tigrowApi.get(`projects?pid=${pid}`, headers);
      await dispatch({ type: CLEAR_ROOMS_REDUCER_STATE_FOR_CHANGE_PROJECT });
      await dispatch({ type: PROJECT.PROJECT_SINGLE_VIEW, payload: response.data });
      return response.data;
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      // return error.response;
    }
  }
};

export const projectPrefaceDescriptionUpdate = (
  pid: string,
  description: string
) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const reqBody = {
        description
      };
      const response = await tigrowApi.put(
        `projects/description?pid=${pid}`,
        reqBody,
        headers
      );
      dispatch({ type: PROJECT.PROJECT_PREFACE_DES_UP });
      return response.data;
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      // return error.response;
    }
  }
};

export const projectPrefaceOutlineUpdate = (
  pid: string,
  outline: string
) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const reqBody = {
        outline
      };
      const response = await tigrowApi.put(
        `projects/outline?pid=${pid}`,
        reqBody,
        headers
      );
      dispatch({ type: PROJECT.PROJECT_PREFACE_OUT_UP });
      return response.data;
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      // return error.response;
    }
  }
};

export const setCurrentProjectId = (pid: string) => async (dispatch: any) => {
  dispatch({ type: PROJECT.PROJECT_PROJECT_ID, payload: pid });
};

export const projectFileUpload: any = (file: any, pid: string) => async (
  dispatch: any
) => {
  try {
    const headers = tokenConfigFIleUpload();
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.post(
        `files/file-upload-project?pid=${pid}`,
        file,
        headers
      );
      dispatch({ type: PROJECT.PROJECT_PREFACE_OUT_UP });
      return response.data;
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      // return error.response;
    }
  }
};

export const getAllPendingProjects = () => async (
  dispatch: any,
  getState: any
) => {
  try {
    const headers = tokenConfig();

    if ((headers as any).headers.Authorization) {
      const companyId = getState().companyReducer.currentCompany._id;
      const response = await tigrowApi.get(
        `projects/${companyId}/pending-requests`,
        headers
      );

      dispatch({
        type: PROJECT.PROJECT_GET_ALL_PENDING_PROJECT,
        payload: response.data
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in selection of company fetching');
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      // return error.response;
    }
  }
};

export const acceptPendingProject = (project: IProject) => async (
  dispatch: any,
  getState: any
) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization && project._id) {
      const companyID = getState().companyReducer.currentCompany._id;
      const pendingProjects = getState().projectReducer.pendingProjects;
      const response = await tigrowApi.put(
        `projects/${companyID}/accept-request?pid=${project._id}`,
        null,
        headers
      );

      if (response.status === 200) {
        const currentPendingProjects = pendingProjects.filter(
          (pending: IPendingProject) =>
            isEqual(pending.project._id, project._id) === false
        );
        dispatch({
          type: PROJECT.PROJECT_GET_ALL_PENDING_PROJECT,
          payload: currentPendingProjects
        });
        dispatch({ type: PROJECT.PROJECT_ADD_PROJECT, payload: project });
        Toaster.create().show({
          message: `Successfully accepted`,
          timeout: 3000,
          intent: 'success'
        });
      } else {
        // tslint:disable-next-line: no-console
        console.log(`Error in accept pending associate`);
      }
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      // return error.response;
    }
  }
};

export const rejectPendingProject = (projectId: string) => async (
  dispatch: any,
  getState: any
) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization && projectId) {
      const companyID = getState().companyReducer.currentCompany._id;
      const pendingProjects = getState().projectReducer.pendingProjects;
      const response = await tigrowApi.put(
        `projects/${companyID}/reject-request?pid=${projectId}`,
        null,
        headers
      );

      if (response.status === 200) {
        const currentPendingProjects = pendingProjects.filter(
          (pending: IPendingProject) =>
            isEqual(pending.project._id, projectId) === false
        );
        dispatch({
          type: PROJECT.PROJECT_GET_ALL_PENDING_PROJECT,
          payload: currentPendingProjects
        });
        Toaster.create().show({
          message: `Successfully rejected`,
          timeout: 3000,
          intent: 'success'
        });
      } else {
        // tslint:disable-next-line: no-console
        console.log(`Error in accept pending associate`);
      }
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      // return error.response;
    }
  }
};

export const updateProjectRole = (optionalRole: any) => async (
  dispatch: any,
  getState: any
) => {
  try {
    const headers = tokenConfig();
    const companyId = getState().companyReducer.currentCompany._id;
    if ((headers as any).headers.Authorization) {
      const reqBody = {
        optionalRole
      };
      await tigrowApi.put(`projects/${companyId}/role`, reqBody, headers);
      dispatch({
        type: PROJECT.PROJECT_UPDATE_ROLE
      });
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      // return error.response;
    }
  }
};

export const getRoleForProject = (projectId: string) => async (
  dispatch: any,
  getState: any
) => {
  try {
    const headers = tokenConfig();
    const userId = getState().userReducer.user._id;
    if ((headers as any).headers.Authorization) {
      await tigrowApi.get(
        `projects/individual/${userId}?pid=${projectId}`,
        headers
      );
      dispatch({
        type: PROJECT.PROJECT_GET_ROLES
      });
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      // return error.response;
    }
  }
};

export const getProjectTeams = () => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const pid = getState().projectReducer.pid;
      const response = await tigrowApi.get(`/teams/member-list?pid=${pid}`, headers);
      await dispatch({ type: PROJECT.PROJECT_GET_TEAMS, payload: response.data.memberList });
      return response.data;
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      // return error.response;
    }
  }
};