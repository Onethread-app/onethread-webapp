import { History } from 'history';
import { ICompany } from 'stores/company/Reducer';
import {
  CLEAR_CHANGE_COMPANY_NAME_ERROR,
  CLEAR_ADD_DEPARTMENT_ERROR,
  CompanyActionTypes,
} from './Types';

export const getCompanyDetails = (name: string) => ({
  type: CompanyActionTypes.GET_COMPANY_DETAILS_START,
  payload: name,
});

export const getCompanyDetailsSuccess = (response: any) => ({
  type: CompanyActionTypes.GET_COMPANY_DETAILS_SUCCESS,
  payload: response,
});

export const getCompanyDetailsFailure = (errorMessage: any) => ({
  type: CompanyActionTypes.GET_COMPANY_DETAILS_FAILURE,
  payload: errorMessage,
});

export const createCompanyAction = (
  companyData: ICompany,
  routeHistory: History,
) => ({
  type: CompanyActionTypes.CREATE_COMPANY_START,
  companyData,
  routeHistory,
});

export const createCompanyActionSuccess = (response: any) => ({
  type: CompanyActionTypes.CREATE_COMPANY_SUCCESS,
  payload: response,
});

export const createCompanyActionFailure = (errorMessage: any) => ({
  type: CompanyActionTypes.CREATE_COMPANY_FAILURE,
  payload: errorMessage,
});

export const getCompanyMembers = () => ({
  type: CompanyActionTypes.GET_ALL_COMPANY_MEMBERS_START,
});

export const getCompanyMembersSuccess = (response: any) => ({
  type: CompanyActionTypes.GET_ALL_COMPANY_MEMBERS_SUCCESS,
  payload: response,
});

export const getCompanyMembersFailure = (errorMessage: any) => ({
  type: CompanyActionTypes.GET_ALL_COMPANY_MEMBERS_FAILURE,
  payload: errorMessage,
});

export const addTeamMembers = (
  members: Array<{ account: string | undefined; company: string }>,
  pendingTeamMembers: string[],
  companyId: string,
) => ({
  type: CompanyActionTypes.ADD_TEAM_MEMBER_START,
  members,
  pendingTeamMembers,
  companyId,
});

export const addTeamMembersSuccess = (response: any) => ({
  type: CompanyActionTypes.ADD_TEAM_MEMBER_SUCCESS,
  payload: response,
});

export const addTeamMembersFailure = (errorMessage: any) => ({
  type: CompanyActionTypes.ADD_TEAM_MEMBER_FAILURE,
  payload: errorMessage,
});

export const deleteCompanyMember = (memberId: string) => ({
  type: CompanyActionTypes.DELETE_TEAM_MEMBER_START,
  payload: memberId,
});

export const deleteCompanyMemberSuccess = (response: any) => ({
  type: CompanyActionTypes.DELETE_TEAM_MEMBER_SUCCESS,
  payload: response,
});

export const deleteCompanyMemberFailure = (errorMessage: any) => ({
  type: CompanyActionTypes.DELETE_TEAM_MEMBER_FAILURE,
  payload: errorMessage,
});

export const addDepartment = (name: string) => ({
  type: CompanyActionTypes.ADD_DEPARTMENT_START,
  name,
});

export const addDepartmentSuccess = (response: any) => ({
  type: CompanyActionTypes.ADD_DEPARTMENT_SUCCESS,
  payload: response,
});

export const addDepartmentFailure = (errorMessage: any) => ({
  type: CompanyActionTypes.ADD_DEPARTMENT_FAILURE,
  payload: errorMessage,
});

export const getAllDepartments = () => ({
  type: CompanyActionTypes.GET_ALL_DEPARTMENT_START,
});

export const getAllDepartmentsSuccess = (response: any) => ({
  type: CompanyActionTypes.GET_ALL_DEPARTMENT_SUCCESS,
  payload: response,
});

export const getAllDepartmentsFailure = (errorMessage: any) => ({
  type: CompanyActionTypes.GET_ALL_DEPARTMENT_FAILURE,
  payload: errorMessage,
});

export const editCompanyInfoAction = (companyInfo: ICompany) => ({
  type: CompanyActionTypes.EDIT_COMPANY_INFO_START,
  payload: companyInfo,
});

export const editCompanyInfoActionSuccess = (response: any) => ({
  type: CompanyActionTypes.EDIT_COMPANY_INFO_SUCCESS,
  payload: response,
});

export const editCompanyInfoActionFailure = (errorMessage: any) => ({
  type: CompanyActionTypes.EDIT_COMPANY_INFO_FAILURE,
  payload: errorMessage,
});

export const editCompanyAboutAction = (companyAbout: string) => ({
  type: CompanyActionTypes.EDIT_COMPANY_INFO_START,
  payload: companyAbout,
});

export const changeCompanyName = (companyName: string) => ({
  type: CompanyActionTypes.CHANGE_COMPANY_NAME_START,
  payload: companyName,
});

export const changeCompanyNameSuccess = (response: any) => ({
  type: CompanyActionTypes.CHANGE_COMPANY_NAME_SUCCESS,
  payload: response,
});

export const changeCompanyNameFailure = (errorMessage: any) => ({
  type: CompanyActionTypes.CHANGE_COMPANY_NAME_FAILURE,
  payload: errorMessage,
});

export const companyLogoUploadAction = (
  imageSelected: any,
  type: string,
) => ({
  type: CompanyActionTypes.CHANGE_COMPANY_LOGO_START,
  imageSelected,
  payload: type,
});

export const companyLogoUploadActionSuccess = (response: any) => ({
  type: CompanyActionTypes.CHANGE_COMPANY_LOGO_SUCCESS,
  payload: response,
});

export const companyCoverUploadActionSuccess = (response: any) => ({
  type: CompanyActionTypes.CHANGE_COMPANY_COVER_SUCCESS,
  payload: response,
});

export const companyLogoUploadActionFailure = (
  errorMessage: any,
) => ({
  type: CompanyActionTypes.CHANGE_COMPANY_LOGO_FAILURE,
  payload: errorMessage,
});

export const addDesignation = (values: any, memberId: string) => ({
  type: CompanyActionTypes.ADD_DESIGNATION_START,
  values,
  memberId,
});

export const addDesignationSuccess = () => ({
  type: CompanyActionTypes.ADD_DESIGNATION_SUCCESS,
});

export const addDesignationFailure = (errorMessage: any) => ({
  type: CompanyActionTypes.ADD_DESIGNATION_FAILURE,
  payload: errorMessage,
});

export const editDesignation = (values: any, memberId: string) => ({
  type: CompanyActionTypes.EDIT_DESIGNATION_START,
  values,
  memberId,
});

export const editDesignationSuccess = () => ({
  type: CompanyActionTypes.EDIT_DESIGNATION_SUCCESS,
});

export const editDesignationFailure = (errorMessage: any) => ({
  type: CompanyActionTypes.EDIT_DESIGNATION_FAILURE,
  payload: errorMessage,
});

export const changeMemberRole = (
  values: { role: string },
  memberId: string,
) => ({
  type: CompanyActionTypes.CHANGE_MEMBER_ROLE_START,
  values,
  memberId,
});

export const changeMemberRoleSuccess = (response: any) => ({
  type: CompanyActionTypes.CHANGE_MEMBER_ROLE_SUCCESS,
  payload: response,
});

export const changeMemberRoleFailure = (errorMessage: any) => ({
  type: CompanyActionTypes.CHANGE_MEMBER_ROLE_FAILURE,
  payload: errorMessage,
});

export const companyOptionalRole = (values: {
  optionalRole: string[];
}) => ({
  type: CompanyActionTypes.CHANGE_COMPANY_OPTIONAL_ROLE_START,
  payload: values,
});

export const companyOptionalRoleSuccess = (response: any) => ({
  type: CompanyActionTypes.CHANGE_COMPANY_OPTIONAL_ROLE_SUCCESS,
  payload: response,
});

export const companyOptionalRoleFailure = (errorMessage: any) => ({
  type: CompanyActionTypes.CHANGE_COMPANY_OPTIONAL_ROLE_FAILURE,
  payload: errorMessage,
});

export const getCompanyPendingMembers = (
  limit: number = 100,
  skip: number = 0,
) => ({
  type: CompanyActionTypes.GET_ALL_COMPANY_PENDING_MEMBERS_START,
  limit,
  skip,
});

export const getCompanyPendingMembersSuccess = (response: any) => ({
  type: CompanyActionTypes.GET_ALL_COMPANY_PENDING_MEMBERS_SUCCESS,
  payload: response,
});

export const getCompanyPendingMembersFailure = (
  errorMessage: any,
) => ({
  type: CompanyActionTypes.GET_ALL_COMPANY_PENDING_MEMBERS_FAILURE,
  payload: errorMessage,
});

export const addCertificate = (certificate: any) => ({
  type: CompanyActionTypes.ADD_COMPANY_CERTIFICATE_START,
  payload: certificate,
});

export const addCertificateSuccess = (response: any) => ({
  type: CompanyActionTypes.ADD_COMPANY_CERTIFICATE_SUCCESS,
  payload: response,
});

export const addCertificateFailure = (errorMessage: any) => ({
  type: CompanyActionTypes.ADD_COMPANY_CERTIFICATE_FAILURE,
  payload: errorMessage,
});

export const addOrganization = (organization: any) => ({
  type: CompanyActionTypes.ADD_ORGANIZATION_START,
  payload: organization,
});

export const addOrganizationSuccess = (response: any) => ({
  type: CompanyActionTypes.ADD_ORGANIZATION_SUCCESS,
  payload: response,
});

export const addOrganizationFailure = (errorMessage: any) => ({
  type: CompanyActionTypes.ADD_ORGANIZATION_FAILURE,
  payload: errorMessage,
});

export const editOrganization = (organization: any, ind: number) => ({
  type: CompanyActionTypes.EDIT_ORGANIZATION_START,
  organization,
  ind,
});

export const editOrganizationSuccess = (response: any) => ({
  type: CompanyActionTypes.EDIT_ORGANIZATION_SUCCESS,
  payload: response,
});

export const editOrganizationFailure = (errorMessage: any) => ({
  type: CompanyActionTypes.EDIT_ORGANIZATION_FAILURE,
  payload: errorMessage,
});

export const getCompanyAnnouncement = () => ({
  type: CompanyActionTypes.GET_ALL_COMPANY_ANNOUNCEMENT_START,
});

export const getCompanyAnnouncementSuccess = (response: any) => ({
  type: CompanyActionTypes.GET_ALL_COMPANY_ANNOUNCEMENT_SUCCESS,
  payload: response,
});

export const getCompanyAnnouncementFailure = (errorMessage: any) => ({
  type: CompanyActionTypes.GET_ALL_COMPANY_ANNOUNCEMENT_FAILURE,
  payload: errorMessage,
});

export const addAnnouncement = (announcement: any) => ({
  type: CompanyActionTypes.ADD_COMPANY_ANNOUNCEMENT_START,
  payload: announcement,
});

export const addAnnouncementSuccess = () => ({
  type: CompanyActionTypes.ADD_COMPANY_ANNOUNCEMENT_SUCCESS,
});

export const addAnnouncementFailure = (errorMessage: any) => ({
  type: CompanyActionTypes.ADD_COMPANY_ANNOUNCEMENT_FAILURE,
  payload: errorMessage,
});

export const getAllProduct = () => ({
  type: CompanyActionTypes.GET_ALL_PRODUCT_START,
});

export const getAllProductSuccess = (response: any) => ({
  type: CompanyActionTypes.GET_ALL_PRODUCT_SUCCESS,
  payload: response,
});

export const getAllProductFailure = (errorMessage: any) => ({
  type: CompanyActionTypes.GET_ALL_PRODUCT_FAILURE,
  payload: errorMessage,
});

export const inviteColleagueInBulk = (emails: any) => ({
  type: CompanyActionTypes.COLLEAGUE_INVITE_START,
  payload: emails,
});

export const inviteColleagueInBulkSuccess = () => ({
  type: CompanyActionTypes.COLLEAGUE_INVITE_SUCCESS,
});

export const inviteColleagueInBulkFailure = (errorMessage: any) => ({
  type: CompanyActionTypes.COLLEAGUE_INVITE_FAILURE,
  payload: errorMessage,
});

export const editCertificate = (certificate: any, id: string) => ({
  type: CompanyActionTypes.EDIT_COMPANY_CERTIFICATE_START,
  certificate,
  id,
});

export const editCertificateSuccess = () => ({
  type: CompanyActionTypes.EDIT_COMPANY_CERTIFICATE_SUCCESS,
});

export const editCertificateFailure = (errorMessage: any) => ({
  type: CompanyActionTypes.EDIT_COMPANY_CERTIFICATE_FAILURE,
  payload: errorMessage,
});

export const getLatestCompletedTasks = () => ({
  type: CompanyActionTypes.GET_LATEST_COMPLETED_TASK_START,
});

export const getLatestCompletedTasksSuccess = (response: any) => ({
  type: CompanyActionTypes.GET_LATEST_COMPLETED_TASK_SUCCESS,
  payload: response,
});

export const getLatestCompletedTasksFailure = (
  errorMessage: any,
) => ({
  type: CompanyActionTypes.GET_LATEST_COMPLETED_TASK_FAILURE,
  payload: errorMessage,
});

export const clearCompanyError = () => ({
  type: CompanyActionTypes.CLEAR_COMPANY_ERROR,
});

export const clearAddDepartmentError = () => async (
  dispatch: any,
) => {
  dispatch({ type: CLEAR_ADD_DEPARTMENT_ERROR });
};

export const clearChangeCompanyNameError = () => async (
  dispatch: any,
) => {
  dispatch({ type: CLEAR_CHANGE_COMPANY_NAME_ERROR });
};
