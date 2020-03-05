import { PROJECT } from './Types';
import { tigrowApi } from 'config';
import { tokenConfig } from 'stores/UtilsActions';
// import { isEqual } from 'lodash';

export const getAllProjects: any = () => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    const companyId = getState().companyReducer.currentCompany._id;
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.get(`projects/lists?companyId=${companyId}`, headers);
      dispatch({ type: PROJECT.PROJECT_GET_ALL_PROJECTS, payload: response.data });
      return response.data;
    }
  } catch (error) {
    //
  }
};

export const createProject: any = (payload: any) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    const companyId = getState().companyReducer.currentCompany._id;
    if ((headers as any).headers.Authorization) {
      const reqBody = {
        name: payload.name,
        type: payload.projectType,
        departments: [payload.departments],
        companyId,
        color: payload.color,
        concernedAdmin: '5e5e3604d0fd026b1fdb0322'
      };
      const response = await tigrowApi.post(`projects/create`, reqBody, headers);
      await dispatch({ type: PROJECT.PROJECT_CREATE, payload: response.data });
      // dispatch({ type: PROJECT.PROJECT_GET_ALL_PROJECTS });
      dispatch(getAllProjects());
      return response.data;
    }
  } catch (error) {
    // console.log(error); 
  }
};

export const archiveProject: any = (pid: string) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      console.log(pid)
      const response = await tigrowApi.put(`projects/${pid}/archive`, null, headers);
      await dispatch({ type: PROJECT.PROJECT_ARCHIVE, payload: response.data });
      // dispatch({ type: PROJECT.PROJECT_GET_ALL_PROJECTS });
      dispatch(getAllProjects());
      return response.data;
    }
  } catch (error) {
    // console.log(error); 
  }
};

export const getProjectArchive: any = () => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    const companyId = getState().companyReducer.currentCompany._id;
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.get(`projects/archive-list?companyId=${companyId}`, headers);
      dispatch({ type: PROJECT.PROJECT_GET_ALL_ARCHIVE, payload: response.data });
      return response.data;
    }
  } catch (error) {
    //
  }
};

export const updateProjectName: any = (payload: any, pid: string) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const reqBody = {
        name: payload.name,
        pid
      };
      const response = await tigrowApi.put(`projects/change-title`, reqBody, headers);
      await dispatch({ type: PROJECT.PROJECT_ARCHIVE, payload: response.data });
      // dispatch({ type: PROJECT.PROJECT_GET_ALL_PROJECTS });
      dispatch(getAllProjects());
      return response.status || response.data;
    }
  } catch (error) {
    // console.log(error); 
  }
};

// Utility Search Action
// export const getSuggestionsForAdmins: any = async () => {
//   try {
//     const headers = tokenConfig();
//     if ((headers as any).headers.Authorization) {
//       const response = await tigrowApi.get(`projects/concern-admin-search`, headers);
//       console.log(response);
//       // setSuggestedMembers(response.data.members);
//       return response;
//     } 
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       // tslint:disable-next-line: no-console
//       console.log('network error');
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log(error.response);
//     }
//   }
// };

// export const uodateProject: any = ()
