import { PROJECT } from './Types';
import { tigrowApi } from 'config';
import { tokenConfig, tokenConfigFIleUpload } from 'stores/UtilsActions';
import { isEqual } from 'lodash';

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

export const createProject = (payload: any, admin: {_id: ''}) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    const companyId = getState().companyReducer.currentCompany._id;
    if ((headers as any).headers.Authorization) {
      const reqBody = {
        name: payload.name,
        type: payload.projectType,
        departments: typeof payload.departments === 'string' ? [payload.departments] : [...payload.departments] ,
        companyId,
        color: payload.color,
        concernedAdmin: admin._id
      };
      const response = await tigrowApi.post(`projects/create`, reqBody, headers);
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
  dispatch({type: PROJECT.PROJECT_PROJECT_ID, payload: pid});
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
