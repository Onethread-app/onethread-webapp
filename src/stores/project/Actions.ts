import { PROJECT } from './Types';
import { tigrowApi } from 'config';
import { tokenConfig } from 'stores/UtilsActions';

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

