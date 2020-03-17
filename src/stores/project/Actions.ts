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
      const response = await tigrowApi.get(`projects/${companyId}/lists`, headers);
      dispatch({ type: PROJECT.PROJECT_GET_ALL_PROJECTS, payload: response.data });
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

export const createProject = (payload: any, admin: { _id: '' }) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    const companyId = getState().companyReducer.currentCompany._id;

    if ((headers as any).headers.Authorization) {
      // const reqBody = {
      //   name: payload.name,
      //   type: payload.projectType,
      //   departments: typeof payload.departments === 'string' ? [payload.departments] : [...payload.departments] ,
      //   companyId,
      //   color: payload.color,
      //   concernedAdmin: admin._id
      // };

      const reqBody = {
        name: payload.name,
        type: payload.projectType,
        concernedAdmin: admin._id,
        companyId,
        departments: payload.department,
        associates: payload.associates
      };

      const response = await tigrowApi.post(`projects/${companyId}/create`, reqBody, headers);
      await dispatch({ type: PROJECT.PROJECT_CREATE, payload: response.data });
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

export const archiveProject = (pid: string) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.put(`projects/${pid}/archive`, null, headers);
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
      const response = await tigrowApi.get(`projects/${companyId}/archive-list`, headers);
      dispatch({ type: PROJECT.PROJECT_GET_ALL_ARCHIVE, payload: response.data });
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

export const updateProjectName = (projectName: string, projectId: string) => async (dispatch: any) => {
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

export const getSingleProject = (pid: string) => async (dispatch: any) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.get(`projects/${pid}`, headers);
      await dispatch({ type: CLEAR_ROOMS_REDUCER_STATE_FOR_CHANGE_PROJECT });
      dispatch({ type: PROJECT.PROJECT_SINGLE_VIEW, payload: response.data });
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

export const projectPrefaceDescriptionUpdate =
  (pid: string, description: string) => async (dispatch: any, getState: any) => {
    try {
      const headers = tokenConfig();
      if ((headers as any).headers.Authorization) {
        const reqBody = {
          description
        };
        const response = await tigrowApi.put(`projects/${pid}/description`, reqBody, headers);
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

export const projectPrefaceOutlineUpdate =
  (pid: string, outline: string) => async (dispatch: any, getState: any) => {
    try {
      const headers = tokenConfig();
      if ((headers as any).headers.Authorization) {
        const reqBody = {
          outline
        };
        const response = await tigrowApi.put(`projects/${pid}/outline`, reqBody, headers);
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

export const projectFileUpload: any = (file: any, pid: string) => async (dispatch: any) => {
  try {
    const headers = tokenConfigFIleUpload();
    if ((headers as any).headers.Authorization) {

      const response = await tigrowApi.post(`files/file-upload-project?pid=${pid}`, file, headers);
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

export const getAllPendingProjects = () => async (dispatch: any, getState: any) => {
  try {

    const headers = tokenConfig();

    if ((headers as any).headers.Authorization) {
      const companyId = getState().companyReducer.currentCompany._id;
      const response = await tigrowApi.get(`projects/${companyId}/pending-requests`, headers);

      dispatch({ type: PROJECT.PROJECT_GET_ALL_PENDING_PROJECT, payload: response.data });
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

export const acceptPendingProject = (project: IProject) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization && project._id) {
      const companyID = getState().companyReducer.currentCompany._id;
      const pendingProjects = getState().projectReducer.pendingProjects;
      const response = await tigrowApi.put(`projects/${companyID}/accept-request?pid=${project._id}`, null, headers);

      if (response.status === 200) {
        const currentPendingProjects = pendingProjects.filter((pending: IPendingProject) =>
          isEqual(pending.project._id, project._id) === false);
        dispatch({ type: PROJECT.PROJECT_GET_ALL_PENDING_PROJECT, payload: currentPendingProjects });
        dispatch({ type: PROJECT.PROJECT_ADD_PROJECT, payload: project });
        Toaster
          .create()
          .show({
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

export const rejectPendingProject = (projectId: string) => async (dispatch: any, getState: any) => {

  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization && projectId) {
      const companyID = getState().companyReducer.currentCompany._id;
      const pendingProjects = getState().projectReducer.pendingProjects;
      const response = await tigrowApi.put(`projects/${companyID}/reject-request?pid=${projectId}`, null, headers);

      if (response.status === 200) {
        const currentPendingProjects = pendingProjects.filter((pending: IPendingProject) =>
          isEqual(pending.project._id, projectId) === false);
        dispatch({ type: PROJECT.PROJECT_GET_ALL_PENDING_PROJECT, payload: currentPendingProjects });
        Toaster
          .create()
          .show({
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
