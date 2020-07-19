import { isEqual } from 'lodash';
import { History } from 'history';
import { tokenConfig } from '../UtilsActions';
import { ICompany } from 'stores/company/Reducer';
import {
  CREATE_COMPANY,
  CREATE_COMPANY_ERROR,
  GET_COMPANY_DETAILS,
  ADD_TEAM_MEMBERS_ERROR,
  ADD_DEPARTMENT,
  ADD_DEPARTMENT_ERROR,
  COMPANY_DEPARTMENT_LOADING,
  GET_ALL_COMPANY_MEMBERS,
  COMPANY_REDUCER_LOADING,
  COMPANY_REDUCER_LOADING_FALSE,
  GET_ALL_DEPARTMENT,
  EDIT_COMPANY_INFO,
  CHANGE_COMPANY_NAME_ERROR,
  CHANGE_COMPANY_NAME,
  CLEAR_CHANGE_COMPANY_NAME_ERROR,
  CHANGE_COMPANY_NAME_LOADING,
  CLEAR_ADD_DEPARTMENT_ERROR,
  ADD_DEPARTMENT_LOADING,
  COMPANY_DESIGNATION_LOADING,
  ADD_DESIGNATION,
  ADD_DESIGNATION_ERROR,
  EDIT_DESIGNATION,
  EDIT_DESIGNATION_ERROR,
  LOGO_UPLOAD,
  CHANGE_MEMBER_ROLE,
  CHANGE_MEMBER_ROLE_ERROR,
  COMPANY_ROLE,
  GET_ALL_COMPANY_PENDING_MEMBERS,
  UPDATE_ALL_COMPANY_PENDING_MEMBERS,
  DELETE_TEAM_MEMBER,
  DELETE_TEAM_MEMBER_ERROR,
  ADD_CERTIFICATE,
  ADD_ORGANIZATION,
  COVER_IMAGE_UPLOAD_COMPANY,
  GET_ALL_COMPANY_ANNOUNCEMENT,
  // ADD_ANNOUNCEMENT,
  GET_ALL_PRODUCT,
  EDIT_ORGANIZATION,
  // ADD_ANNOUNCEMENT
} from './Types';
import {
  CLEAR_ROOMS_REDUCER_STATE,
  CLEAR_ROOMS_REDUCER_STATE_FOR_CHANGE_COMPANY,
} from 'stores/room/Types';
import { errorMessgeHandler } from 'components/final-form/utils';
import { tigrowApi } from 'config';
import { Toaster } from '@blueprintjs/core';
import { CLEAR_PROJECT_REDUCER_STATE } from 'stores/project/Types';

export const getCompanyDetails = (name: string) => async (
  dispatch: any,
  getState: any,
) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.get(
        `company/${name}`,
        headers,
      );
      dispatch({
        type: GET_COMPANY_DETAILS,
        payload: response.data.company,
      });
      dispatch({
        type: CLEAR_ROOMS_REDUCER_STATE_FOR_CHANGE_COMPANY,
      });
      return response;
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in selection of company fetching');
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({
        type: CREATE_COMPANY_ERROR,
        payload: 'Network error',
      });
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      return error.response.status;
    }
  }
};

export const createCompanyAction = (
  companyData: ICompany,
  routeHistory: History,
) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.post(
        `company`,
        companyData,
        headers,
      );
      dispatch({ type: CLEAR_PROJECT_REDUCER_STATE });
      dispatch({ type: CLEAR_ROOMS_REDUCER_STATE });
      dispatch({ type: CREATE_COMPANY, payload: response.data });
      routeHistory.push(
        `/company/${response.data.company.uniqueName}/dashboard`,
      );
      return response.data;
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in creation of company');
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({
        type: CREATE_COMPANY_ERROR,
        payload: {
          message: 'Network error',
          network: true,
        },
      });
    } else if (error.response.status === 409) {
      dispatch({
        type: CREATE_COMPANY_ERROR,
        payload: {
          message: 'Duplicate Company Name',
          network: false,
        },
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
  }
};

export const getCompanyMembers = () => async (
  dispatch: any,
  getState: any,
) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const companyId = getState().companyReducer.currentCompany._id;
      dispatch({ type: COMPANY_REDUCER_LOADING });
      const response = await tigrowApi.get(
        `company/${companyId}/members?limit=100`,
        headers,
      );
      dispatch({
        type: GET_ALL_COMPANY_MEMBERS,
        payload: response.data,
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in selection of company fetching');
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({
        type: ADD_TEAM_MEMBERS_ERROR,
        payload: 'Network error',
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
  }
};

export const addTeamMembers = (
  members: Array<{ account: string | undefined; company: string }>,
  pendingTeamMembers: string[],
  companyId: string,
) => async (dispatch: any) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      dispatch({ type: COMPANY_REDUCER_LOADING });
      const response = await tigrowApi.post(
        `company/${companyId}/members`,
        { members, pendingTeamMembers },
        headers,
      );
      if (response.data.pendingMembers.length > 0) {
        dispatch({
          type: UPDATE_ALL_COMPANY_PENDING_MEMBERS,
          payload: response.data.pendingMembers,
        });
      }
      dispatch({ type: COMPANY_REDUCER_LOADING_FALSE });
      // dispatch({ type: ADD_TEAM_MEMBERS, payload: response.data });
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in selection of company fetching');
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({
        type: ADD_TEAM_MEMBERS_ERROR,
        payload: 'Network error',
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
  }
};

export const deleteCompanyMember = (memberId: string) => async (
  dispatch: any,
  getState: any,
) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const companyId = getState().companyReducer.currentCompany._id;
      await tigrowApi.delete(
        `company/${companyId}/members/${memberId}`,
        headers,
      );
      dispatch({ type: DELETE_TEAM_MEMBER, payload: memberId });
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in selection of company fetching');
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({
        type: DELETE_TEAM_MEMBER_ERROR,
        payload: 'Network error',
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
  }
};

export const addDepartment = (name: string) => async (
  dispatch: any,
  getState: any,
) => {
  try {
    const headers = tokenConfig();
    let response;
    if ((headers as any).headers.Authorization) {
      dispatch({ type: ADD_DEPARTMENT_LOADING });
      const companyId = getState().companyReducer.currentCompany._id;
      response = await tigrowApi.post(
        `company/${companyId}/departments`,
        { name },
        headers,
      );
      dispatch({ type: ADD_DEPARTMENT, payload: response.data });
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in adding department');
    }
    return errorMessgeHandler(response);
  } catch (error) {
    return errorMessgeHandler(error);
  }
};

export const clearAddDepartmentError = () => async (
  dispatch: any,
) => {
  dispatch({ type: CLEAR_ADD_DEPARTMENT_ERROR });
};

export const getAllDepartments = () => async (
  dispatch: any,
  getState: any,
) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      dispatch({ type: COMPANY_DEPARTMENT_LOADING });
      const companyId = getState().companyReducer.currentCompany._id;
      const response = await tigrowApi.get(
        `company/${companyId}/departments`,
        headers,
      );
      dispatch({ type: GET_ALL_DEPARTMENT, payload: response.data });
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in adding department');
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({
        type: ADD_DEPARTMENT_ERROR,
        payload: 'Network error',
      });
    } else if (error.response.status === 401) {
      dispatch({
        type: ADD_DEPARTMENT_ERROR,
        payload: 'Unauthorized user.',
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
  }
};

export const editCompanyInfoAction = (
  companyInfo: ICompany,
) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const companyId = getState().companyReducer.currentCompany._id;
      await tigrowApi.put(
        `company/${companyId}/basic`,
        companyInfo,
        headers,
      );
      dispatch({ type: EDIT_COMPANY_INFO, payload: companyInfo });
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in user fetching');
    }
  } catch (error) {
    // tslint:disable-next-line: no-console
    console.log(error);
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('Network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
  }
};

export const editCompanyAboutAction = (
  companyAbout: string,
) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const companyId = getState().companyReducer.currentCompany._id;
      await tigrowApi.put(
        `company/${companyId}/about`,
        { about: companyAbout },
        headers,
      );
      dispatch({
        type: EDIT_COMPANY_INFO,
        payload: { about: companyAbout },
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in user fetching');
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('Network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
  }
};

export const changeCompanyName = (companyName: string) => async (
  dispatch: any,
  getState: any,
) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      dispatch({ type: CHANGE_COMPANY_NAME_LOADING });
      const companyId = getState().companyReducer.currentCompany._id;
      const response = await tigrowApi.put(
        `company/${companyId}/changeName`,
        { name: companyName },
        headers,
      );
      dispatch({
        type: CHANGE_COMPANY_NAME,
        payload: response.data.company,
      });
      return response;
    } else {
      //TODO create a logger for client end
      return;
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      //TODO create a logger for client end
      return;
    } else if (error.response.status === 409) {
      dispatch({
        type: CHANGE_COMPANY_NAME_ERROR,
        payload: 'Name already exist',
      });
      return;
    } else {
      //  TODO create a logger for client end
      return;
    }
  }
};

export const clearChangeCompanyNameError = () => async (
  dispatch: any,
) => {
  dispatch({ type: CLEAR_CHANGE_COMPANY_NAME_ERROR });
};

export const companyLogoUploadAction = (
  imageSelected: any,
  type: string,
) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    const companyId = getState().companyReducer.currentCompany._id;
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.post(
        `files/${companyId}/upload?imageType=${type}`,
        imageSelected,
        headers,
      );
      if (response.data.imageType === 'company-logo') {
        dispatch({
          type: LOGO_UPLOAD,
          payload: { ...response.data, link: response.data.link },
        });
      } else if (response.data.imageType === 'company-cover-photo') {
        dispatch({
          type: COVER_IMAGE_UPLOAD_COMPANY,
          payload: { ...response.data, link: response.data.link },
        });
      }
      return response.data;
    } else {
      // tslint:disable-next-line: no-console
      console.log('no headers');
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
  }
};

export const addDesignation = (
  values: any,
  memberId: string,
) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      dispatch({ type: COMPANY_DESIGNATION_LOADING });
      const companyId = getState().companyReducer.currentCompany._id;
      const response = await tigrowApi.post(
        `company/${companyId}/designations/${memberId}`,
        values,
        headers,
      );
      dispatch({ type: ADD_DESIGNATION });
      return response.status;
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in adding designation');
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({
        type: ADD_DESIGNATION_ERROR,
        payload: 'Network error',
      });
    } else if (error.response.status === 401) {
      dispatch({
        type: ADD_DESIGNATION_ERROR,
        payload: 'Unauthorized user.',
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
    return error.response.status;
  }
};

export const editDesignation = (
  values: any,
  memberId: string,
) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      dispatch({ type: COMPANY_DESIGNATION_LOADING });
      const companyId = getState().companyReducer.currentCompany._id;
      const response = await tigrowApi.put(
        `company/${companyId}/designations/${memberId}`,
        values,
        headers,
      );
      dispatch({ type: EDIT_DESIGNATION });
      return response.status;
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in adding designation');
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({
        type: EDIT_DESIGNATION_ERROR,
        payload: 'Network error',
      });
    } else if (error.response.status === 401) {
      dispatch({
        type: EDIT_DESIGNATION_ERROR,
        payload: 'Unauthorized user.',
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
    return error.response.status;
  }
};

export const changeMemberRole = (
  values: { role: string },
  memberId: string,
) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const companyId = getState().companyReducer.currentCompany._id;
      const response = await tigrowApi.put(
        `/company/${companyId}/members/${memberId}/changeRole`,
        values,
        headers,
      );
      dispatch({
        type: CHANGE_MEMBER_ROLE,
        payload: { memberId, role: values.role },
      });
      return response.status;
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in changing member role');
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({
        type: CHANGE_MEMBER_ROLE_ERROR,
        payload: 'Network error',
      });
    } else if (error.response.status === 401) {
      dispatch({
        type: CHANGE_MEMBER_ROLE_ERROR,
        payload: 'Unauthorized user.',
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
    return error.response.status;
  }
};

export const companyOptionalRole = (values: {
  optionalRole: string[];
}) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    const companyId = getState().companyReducer.currentCompany._id;
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.put(
        `company/${companyId}/role`,
        values,
        headers,
      );
      if (response.status === 200) {
        dispatch({
          type: COMPANY_ROLE,
          payload: values.optionalRole,
        });
        Toaster.create().show({
          message: 'Company admin role updated successfully',
          timeout: 3000,
          intent: 'success',
        });
      }
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      Toaster.create().show({
        message: 'Network is disconnected.',
        action: {
          icon: 'refresh',
          className: 'bp3-intent-warning b',
          onClick: () => {
            window.location.reload(false);
          },
          text: 'Reload',
        },
        timeout: 300000,
      });
    } else {
      Toaster.create().show({
        message: error.response.data.errors[0].message,
        intent: 'danger',
        timeout: 300000,
      });
    }
  }
};
export const getCompanyPendingMembers = (
  limit: number = 100,
  skip: number = 0,
) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const companyId = getState().companyReducer.currentCompany._id;
      const response = await tigrowApi.get(
        `company/${companyId}/members/pending?limit=${limit}&skip=${skip}`,
        headers,
      );
      dispatch({
        type: GET_ALL_COMPANY_PENDING_MEMBERS,
        payload: response.data.pendingMember,
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in getting of pending members');
    }
  } catch (error) {
    // tslint:disable-next-line: no-console
    console.log(error);
  }
};

export const addCertificate = (certificate: any) => async (
  dispatch: any,
  getState: any,
) => {
  try {
    const headers = tokenConfig();
    let response;
    if ((headers as any).headers.Authorization) {
      const companyId = getState().companyReducer.currentCompany._id;
      response = await tigrowApi.post(
        `company/${companyId}/certification`,
        certificate,
        headers,
      );
      dispatch({ type: ADD_CERTIFICATE, payload: certificate });
      return response.status;
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in adding certificate');
    }
    return;
  } catch (error) {
    return false;
  }
};

export const addOrganization = (organization: any) => async (
  dispatch: any,
  getState: any,
) => {
  try {
    const headers = tokenConfig();
    let response;
    if ((headers as any).headers.Authorization) {
      dispatch({
        type: ADD_ORGANIZATION,
        payload: organization.parentcom,
      });
      const companyId = getState().companyReducer.currentCompany._id;
      const parentOrgArray = getState().companyReducer.currentCompany
        .parentcom;
      response = await tigrowApi.put(
        `company/${companyId}/parentorg`,
        { parentcom: parentOrgArray },
        headers,
      );
      return response.status;
    } else {
      // tslint:disable-next-line: no-console
      // console.log('error in adding organization');
    }
    return;
  } catch (error) {
    return false;
  }
};

export const editOrganization = (
  organization: any,
  ind: number,
) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    let response;
    if ((headers as any).headers.Authorization) {
      const companyId = getState().companyReducer.currentCompany._id;
      const parentOrgArray = getState().companyReducer.currentCompany
        .parentcom;
      parentOrgArray[ind] = organization.parentcom;
      response = await tigrowApi.put(
        `company/${companyId}/parentorg`,
        { parentcom: parentOrgArray },
        headers,
      );
      dispatch({
        type: EDIT_ORGANIZATION,
        payload: response.data.data.parentcom,
      });
      return response.status;
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in adding organization');
    }
    return;
  } catch (error) {
    return false;
  }
};

export const getCompanyAnnouncement = () => async (
  dispatch: any,
  getState: any,
) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const companyId = getState().companyReducer.currentCompany._id;
      const response = await tigrowApi.get(
        `company/${companyId}/announcements`,
        headers,
      );
      dispatch({
        type: GET_ALL_COMPANY_ANNOUNCEMENT,
        payload: response.data.announce,
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in getting of pending members');
    }
  } catch (error) {
    // tslint:disable-next-line: no-console
    console.log(error);
  }
};

export const addAnnouncement = (announcement: any) => async (
  dispatch: any,
  getState: any,
) => {
  try {
    const headers = tokenConfig();
    let response;
    if ((headers as any).headers.Authorization) {
      const announce = {
        text: announcement,
      };
      const companyId = getState().companyReducer.currentCompany._id;
      response = await tigrowApi.post(
        `company/${companyId}/announcements`,
        announce,
        headers,
      );
      dispatch(getCompanyAnnouncement());
      return response.status;
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in adding organization');
    }
    return;
  } catch (error) {
    return false;
  }
};

export const getAllProduct = () => async (
  dispatch: any,
  getState: any,
) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const companyId = getState().companyReducer.currentCompany._id;
      const response = await tigrowApi.get(
        `category/products/${companyId}`,
        headers,
      );
      dispatch({ type: GET_ALL_PRODUCT, payload: response.data });
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in getting product');
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
  }
};
