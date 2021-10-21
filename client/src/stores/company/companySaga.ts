import { all, put, call, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import { tokenConfig } from 'stores/UtilsActions';
import { tigrowApi } from 'config';
import { CompanyActionTypes } from './Types';
import {
  createCompanyActionSuccess,
  createCompanyActionFailure,
  getCompanyDetailsSuccess,
  getCompanyDetailsFailure,
  getCompanyMembersSuccess,
  getCompanyMembersFailure,
  addTeamMembersSuccess,
  addTeamMembersFailure,
  deleteCompanyMemberSuccess,
  deleteCompanyMemberFailure,
  addDepartmentSuccess,
  addDepartmentFailure,
  getAllDepartmentsSuccess,
  getAllDepartmentsFailure,
  editCompanyInfoActionSuccess,
  editCompanyInfoActionFailure,
  changeCompanyNameSuccess,
  changeCompanyNameFailure,
  companyLogoUploadActionSuccess,
  companyCoverUploadActionSuccess,
  companyLogoUploadActionFailure,
  addDesignationSuccess,
  addDesignationFailure,
  editDesignationSuccess,
  editDesignationFailure,
  changeMemberRoleSuccess,
  changeMemberRoleFailure,
  companyOptionalRoleSuccess,
  getCompanyPendingMembersSuccess,
  getCompanyPendingMembersFailure,
  addCertificateSuccess,
  addCertificateFailure,
  addOrganizationSuccess,
  addOrganizationFailure,
  editOrganizationSuccess,
  editOrganizationFailure,
  getCompanyAnnouncementSuccess,
  getCompanyAnnouncementFailure,
  addAnnouncementSuccess,
  getCompanyAnnouncement,
  addAnnouncementFailure,
  getAllProductSuccess,
  getAllProductFailure,
  getCompanyPendingMembers,
  getCompanyMembers,
  inviteColleagueInBulkSuccess,
  inviteColleagueInBulkFailure,
  getCompanyDetails,
  editCertificateSuccess,
  editCertificateFailure,
  getLatestCompletedTasksSuccess,
  getLatestCompletedTasksFailure,
  getAllDepartments,
  clearCompanyError,
  updateCompanyLoading,
  companyOptionalRoleFailure,
  requestToJoinCompanySuccess,
  requestToJoinCompanyFailure,
  getCompanySearchResultSuccess,
  getCompanySearchResultFailure,
  getCompanyPublicInformationSuccess,
  getCompanyPublicInformationFailure,
} from './Actions';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { CLEAR_PROJECT_REDUCER_STATE } from 'stores/project/Types';
import {
  CLEAR_ROOMS_REDUCER_STATE,
  CLEAR_ROOMS_REDUCER_STATE_FOR_CHANGE_COMPANY,
} from 'stores/room/Types';
import {
  getCompanyId,
  getCompanyName,
  getParentCompany,
} from './Selector';
import { Toaster } from '@blueprintjs/core';
import { getAllProjects } from 'stores/project/Actions';
import { returnErrorText } from 'helpers/HandleSagaErrors';
import { setSubscriptionNotExpire } from 'stores/subscriptionBilling/Actions';

const takeEvery: any = Eff.takeEvery;
const takeLatest: any = Eff.takeLatest;

export function* createCompanyAsync({ companyData }: any) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.post(
        `company`,
        companyData,
        headers,
      );
      yield all([
        put({ type: CLEAR_PROJECT_REDUCER_STATE }),
        put({ type: CLEAR_ROOMS_REDUCER_STATE }),
        put(createCompanyActionSuccess(response.data)),
      ]);
    }
  } catch (error) {
    yield put(createCompanyActionFailure(error));
  }
}

export function* getCompanyDetailsAsync({ payload }: any) {
  try {
    if (payload) {
      yield put(showLoading());
      const headers = tokenConfig();
      yield all([
        put(setSubscriptionNotExpire()),
        put(clearCompanyError()),
      ]);

      if ((headers as any).headers.Authorization) {
        const response = yield tigrowApi.get(
          `company/${payload}`,
          headers,
        );
        yield all([
          put({ type: CLEAR_ROOMS_REDUCER_STATE_FOR_CHANGE_COMPANY }),
          put(getCompanyDetailsSuccess(response.data.company)),
          put(getAllProjects()),
        ]);
      } else {
        // tslint:disable-next-line: no-console
      }
    } else {
      yield put(updateCompanyLoading(false));
    }
  } catch (error) {
    yield put(getCompanyDetailsFailure(returnErrorText(error)));
  } finally {
    yield put(hideLoading());
  }
}

export function* getCompanyMembersAsync() {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const companyId = yield select(getCompanyId);
      const response = yield tigrowApi.get(
        `company/${companyId}/members?limit=100`,
        headers,
      );
      yield put(getCompanyMembersSuccess(response.data));
    }
  } catch (error) {
    yield put(getCompanyMembersFailure(returnErrorText(error)));
  }
}

export function* addTeamMembersAsync({
  members,
  pendingTeamMembers,
  companyId,
}: any) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.post(
        `company/${companyId}/members`,
        { members, pendingTeamMembers },
        headers,
      );
      yield put(addTeamMembersSuccess(response.data));
    }
  } catch (error) {
    yield put(addTeamMembersFailure(returnErrorText(error)));
  }
}

export function* deleteCompanyMemberAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    if ((headers as any).headers.Authorization) {
      tigrowApi.delete(
        `company/${companyId}/members/${payload}`,
        headers,
      );
      yield put(deleteCompanyMemberSuccess(payload));
    }
  } catch (error) {
    yield put(deleteCompanyMemberFailure(returnErrorText(error)));
  }
}

export function* addDepartmentAsync({ name }: any) {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.post(
        `company/${companyId}/departments`,
        { name },
        headers,
      );
      yield all([
        put(addDepartmentSuccess(response.data)),
        put(getAllDepartments()),
      ]);
    }
  } catch (error) {
    yield put(addDepartmentFailure(returnErrorText(error)));
  }
}

export function* getAllDepartmentsAsync() {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `company/${companyId}/departments`,
        headers,
      );
      yield put(getAllDepartmentsSuccess(response.data));
    }
  } catch (error) {
    yield put(getAllDepartmentsFailure(returnErrorText(error)));
  }
}

export function* editCompanyInfoAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    yield tigrowApi.put(
      `company/${companyId}/basic`,
      payload,
      headers,
    );
    yield put(editCompanyInfoActionSuccess(payload));
  } catch (error) {
    yield put(editCompanyInfoActionFailure(returnErrorText(error)));
  }
}

export function* changeCompanyNameAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.put(
        `company/${companyId}/changeName`,
        { name: payload },
        headers,
      );
      yield put(changeCompanyNameSuccess(response.data.company));
    }
  } catch (error) {
    yield put(changeCompanyNameFailure(returnErrorText(error)));
  }
}

export function* uploadCompanyLogoAsync({
  imageSelected,
  payload,
}: any) {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.post(
        `files/${companyId}/upload?imageType=${payload}`,
        imageSelected,
        headers,
      );
      if (response.data.imageType === 'company-logo') {
        yield put(
          companyLogoUploadActionSuccess({
            ...response.data,
            link: response.data.link,
          }),
        );
      } else if (response.data.imageType === 'company-cover-photo') {
        yield put(
          companyCoverUploadActionSuccess({
            ...response.data,
            link: response.data.link,
          }),
        );
      }
    }
  } catch (error) {
    yield put(companyLogoUploadActionFailure(returnErrorText(error)));
  }
}

export function* addDesignationAsync({ values, memberId }: any) {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    if ((headers as any).headers.Authorization) {
      yield tigrowApi.post(
        `company/${companyId}/designations/${memberId}`,
        values,
        headers,
      );
      yield all([
        put(addDesignationSuccess()),
        put(getCompanyMembers()),
      ]);
    }
  } catch (error) {
    yield put(addDesignationFailure(returnErrorText(error)));
  }
}

export function* editDesignationAsync({ values, memberId }: any) {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    if ((headers as any).headers.Authorization) {
      yield tigrowApi.put(
        `company/${companyId}/designations/${memberId}`,
        values,
        headers,
      );
      yield all([
        put(editDesignationSuccess()),
        put(getCompanyMembers()),
      ]);
    }
  } catch (error) {
    yield put(editDesignationFailure(returnErrorText(error)));
  }
}

export function* changeMemberRoleAsync({ values, memberId }: any) {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    if ((headers as any).headers.Authorization) {
      yield tigrowApi.put(
        `/company/${companyId}/members/${memberId}/changeRole`,
        values,
        headers,
      );
      yield put(
        changeMemberRoleSuccess({ memberId, role: values.role }),
      );
    }
  } catch (error) {
    yield put(changeMemberRoleFailure(returnErrorText(error)));
  }
}

export function* changeCompanyOptionalRoleAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.put(
        `company/${companyId}/role`,
        payload,
        headers,
      );
      if (response.status === 200) {
        yield put(companyOptionalRoleSuccess(payload.optionalRole));
        Toaster.create().show({
          message: 'Company admin role updated successfully',
          timeout: 3000,
          intent: 'success',
        });
      }
    }
  } catch (error) {
    yield put(companyOptionalRoleFailure(returnErrorText(error)));
  }
}

export function* getCompanyPendingMembersAsync({ limit, skip }: any) {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `company/${companyId}/members/pending?limit=${limit}&skip=${skip}`,
        headers,
      );
      yield put(
        getCompanyPendingMembersSuccess(response.data.pendingMember),
      );
    }
  } catch (error) {
    yield put(
      getCompanyPendingMembersFailure(returnErrorText(error)),
    );
  }
}

export function* addCertificateAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.post(
        `company/${companyId}/certification`,
        payload,
        headers,
      );
      yield put(addCertificateSuccess(response.data.certificate));
    }
  } catch (error) {
    yield put(addCertificateFailure(returnErrorText(error)));
  }
}

export function* addOrganizationAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    const parentCompany = yield select(getParentCompany);
    if ((headers as any).headers.Authorization) {
      yield tigrowApi.put(
        `company/${companyId}/parentorg`,
        { parentcom: parentCompany },
        headers,
      );
      yield put(addOrganizationSuccess(payload.parentcom));
    }
  } catch (error) {
    yield put(addOrganizationFailure(returnErrorText(error)));
  }
}

export function* editOrganizationAsync({ organization, ind }: any) {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    const parentCompany = yield select(getParentCompany);
    if ((headers as any).headers.Authorization) {
      parentCompany[ind] = organization.parentcom;
      const response = yield tigrowApi.put(
        `company/${companyId}/parentorg`,
        { parentcom: parentCompany },
        headers,
      );
      yield put(
        editOrganizationSuccess(response.data.data.parentcom),
      );
    }
  } catch (error) {
    yield put(editOrganizationFailure(returnErrorText(error)));
  }
}

export function* getAllCompanyAnnouncementAsync() {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    if ((headers as any).headers.Authorization && companyId) {
      const response = yield tigrowApi.get(
        `company/${companyId}/announcements`,
        headers,
      );
      yield put(
        getCompanyAnnouncementSuccess(response.data.announce),
      );
    }
  } catch (error) {
    yield put(getCompanyAnnouncementFailure(returnErrorText(error)));
  }
}

export function* addAnnouncementAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    const announce = {
      text: payload,
    };
    if ((headers as any).headers.Authorization && companyId) {
      yield tigrowApi.post(
        `company/${companyId}/announcements`,
        announce,
        headers,
      );
      yield all([
        put(addAnnouncementSuccess()),
        put(getCompanyAnnouncement()),
      ]);
    }
  } catch (error) {
    yield put(addAnnouncementFailure(returnErrorText(error)));
  }
}

export function* getAllProductAsync() {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `category/products/${companyId}`,
        headers,
      );
      yield put(getAllProductSuccess(response.data));
    }
  } catch (error) {
    yield put(getAllProductFailure(returnErrorText(error)));
  }
}

export function* inviteColleagueInBulkAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.post(
        `company/${companyId}/members/bulk`,
        payload,
        headers,
      );
      if (response.status === 200) {
        yield all([
          put(inviteColleagueInBulkSuccess()),
          put(getCompanyPendingMembers()),
          put(getCompanyMembers()),
        ]);
        Toaster.create().show({
          message: `Invitation sent to ${payload.length} emails.`,
          timeout: 3000,
          intent: 'success',
        });
      }
    }
  } catch (error) {
    yield put(inviteColleagueInBulkFailure(returnErrorText(error)));
  }
}

export function* editCertificateAsync({ certificate, id }: any) {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    const companyName = yield select(getCompanyName);
    if ((headers as any).headers.Authorization) {
      yield tigrowApi.put(
        `company/${companyId}/certification?certificateId=${id}`,
        certificate,
        headers,
      );
      yield all([
        put(editCertificateSuccess()),
        put(getCompanyDetails(companyName)),
      ]);
    }
  } catch (error) {
    yield put(editCertificateFailure(returnErrorText(error)));
  }
}

export function* getLatestCompletedTasksAsync() {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    if ((headers as any).headers.Authorization && companyId) {
      const response = yield tigrowApi.get(
        `company/${companyId}/latest-completed-tasks`,
        headers,
      );
      yield put(getLatestCompletedTasksSuccess(response.data.data));
    }
  } catch (error) {
    yield put(getLatestCompletedTasksFailure(returnErrorText(error)));
  }
}

export function* getCompanySearchResultsAsync(action: {
  payload: string;
}) {
  try {
    const headers = tokenConfig();
    const response = yield tigrowApi.get(
      `/company/find?name=${action.payload}`,
      headers,
    );
    if (response.status === 200) {
      yield put(getCompanySearchResultSuccess(response.data.data));
    }
  } catch (error) {
    yield put(getCompanySearchResultFailure(returnErrorText(error)));
  }
}

export function* requestToJoinCompanyAsync(action: {
  payload: string;
}) {
  try {
    const headers = tokenConfig();
    const response = yield tigrowApi.post(
      `/company/${action.payload}/members/join-request`,
      {},
      headers,
    );
    yield put(requestToJoinCompanySuccess(response.data));
    Toaster.create().show({
      message: `Join request was successful`,
      timeout: 3000,
      intent: 'success',
    });
  } catch (error: any) {
    yield put(requestToJoinCompanyFailure(returnErrorText(error)));
  }
}

export function* getCompanyPublicInformationAsync(action: {
  payload: string;
}) {
  try {
    const response = yield tigrowApi.get(
      `/company/${action.payload}/public`,
    );
    // console.log(action.payload, response.data);

    yield put(getCompanyPublicInformationSuccess(response.data));
  } catch (error) {
    yield put(
      getCompanyPublicInformationFailure(returnErrorText(error)),
    );
  }
}

export function* onCreateCompany() {
  yield takeEvery(
    CompanyActionTypes.CREATE_COMPANY_START,
    createCompanyAsync,
  );
}

export function* onGetCompanyDetails() {
  yield takeLatest(
    CompanyActionTypes.GET_COMPANY_DETAILS_START,
    getCompanyDetailsAsync,
  );
}

export function* onGetCompanyMembers() {
  yield takeLatest(
    CompanyActionTypes.GET_ALL_COMPANY_MEMBERS_START,
    getCompanyMembersAsync,
  );
}

export function* onAddTeamMembers() {
  yield takeEvery(
    CompanyActionTypes.ADD_TEAM_MEMBER_START,
    addTeamMembersAsync,
  );
}

export function* onDeleteCompanyMember() {
  yield takeEvery(
    CompanyActionTypes.DELETE_COMPANY_MEMBER_START,
    deleteCompanyMemberAsync,
  );
}

export function* onAddDepartment() {
  yield takeEvery(
    CompanyActionTypes.ADD_DEPARTMENT_START,
    addDepartmentAsync,
  );
}

export function* onGetAllDepartments() {
  yield takeLatest(
    CompanyActionTypes.GET_ALL_DEPARTMENT_START,
    getAllDepartmentsAsync,
  );
}

export function* onEditCompanyInfo() {
  yield takeLatest(
    CompanyActionTypes.EDIT_COMPANY_INFO_START,
    editCompanyInfoAsync,
  );
}

export function* onChangeCompanyName() {
  yield takeLatest(
    CompanyActionTypes.CHANGE_COMPANY_NAME_START,
    changeCompanyNameAsync,
  );
}

export function* onUploadCompanyLogo() {
  yield takeLatest(
    CompanyActionTypes.CHANGE_COMPANY_LOGO_START,
    uploadCompanyLogoAsync,
  );
}

export function* onAddDesignation() {
  yield takeLatest(
    CompanyActionTypes.ADD_DESIGNATION_START,
    addDesignationAsync,
  );
}

export function* onEditDesignation() {
  yield takeLatest(
    CompanyActionTypes.EDIT_DESIGNATION_START,
    editDesignationAsync,
  );
}

export function* onChangeMemberRole() {
  yield takeLatest(
    CompanyActionTypes.CHANGE_MEMBER_ROLE_START,
    changeMemberRoleAsync,
  );
}

export function* onChangeCompanyOptionalRole() {
  yield takeLatest(
    CompanyActionTypes.CHANGE_COMPANY_OPTIONAL_ROLE_START,
    changeCompanyOptionalRoleAsync,
  );
}

export function* onGetAllCompanyPendingMembers() {
  yield takeLatest(
    CompanyActionTypes.GET_ALL_COMPANY_PENDING_MEMBERS_START,
    getCompanyPendingMembersAsync,
  );
}

export function* onAddCompanyCertificate() {
  yield takeLatest(
    CompanyActionTypes.ADD_COMPANY_CERTIFICATE_START,
    addCertificateAsync,
  );
}

export function* onAddOrganization() {
  yield takeEvery(
    CompanyActionTypes.ADD_ORGANIZATION_START,
    addOrganizationAsync,
  );
}

export function* onEditOrganization() {
  yield takeLatest(
    CompanyActionTypes.EDIT_ORGANIZATION_START,
    editOrganizationAsync,
  );
}

export function* onGetCompanyAnnouncement() {
  yield takeLatest(
    CompanyActionTypes.GET_ALL_COMPANY_ANNOUNCEMENT_START,
    getAllCompanyAnnouncementAsync,
  );
}

export function* onAddCompanyAnnouncement() {
  yield takeEvery(
    CompanyActionTypes.ADD_COMPANY_ANNOUNCEMENT_START,
    addAnnouncementAsync,
  );
}

export function* onGetAllProduct() {
  yield takeLatest(
    CompanyActionTypes.GET_ALL_PRODUCT_START,
    getAllProductAsync,
  );
}

export function* onInviteColleagueInBulk() {
  yield takeEvery(
    CompanyActionTypes.COLLEAGUE_INVITE_START,
    inviteColleagueInBulkAsync,
  );
}

export function* onEditCompanyCertificate() {
  yield takeLatest(
    CompanyActionTypes.EDIT_COMPANY_CERTIFICATE_START,
    editCertificateAsync,
  );
}

export function* onGetLatestCompletedTasks() {
  yield takeLatest(
    CompanyActionTypes.GET_LATEST_COMPLETED_TASK_START,
    getLatestCompletedTasksAsync,
  );
}

export function* getCompanySearchResultsAsyncHandler() {
  yield takeEvery(
    CompanyActionTypes.FIND_COMPANY_BY_NAME_START,
    getCompanySearchResultsAsync,
  );
}

export function* requestToJoinCompanyAsyncHandler() {
  yield takeEvery(
    CompanyActionTypes.JOIN_COMPANY_REQUEST_START,
    requestToJoinCompanyAsync,
  );
}

export function* getCompanyPublicInformationHandler() {
  yield takeEvery(
    CompanyActionTypes.PUBLIC_COMPANY_DETAILS_START,
    getCompanyPublicInformationAsync,
  );
}

export default function* companySaga() {
  yield all([
    call(onCreateCompany),
    call(onGetCompanyDetails),
    call(onGetCompanyMembers),
    call(onAddTeamMembers),
    call(onAddDepartment),
    call(onGetAllDepartments),
    call(onEditCompanyInfo),
    call(onChangeCompanyName),
    call(onUploadCompanyLogo),
    call(onAddDesignation),
    call(onEditDesignation),
    call(onChangeMemberRole),
    call(onChangeCompanyOptionalRole),
    call(onGetAllCompanyPendingMembers),
    call(onAddCompanyCertificate),
    call(onAddOrganization),
    call(onEditOrganization),
    call(onGetCompanyAnnouncement),
    call(onAddCompanyAnnouncement),
    call(onGetAllProduct),
    call(onInviteColleagueInBulk),
    call(onEditCompanyCertificate),
    call(onGetLatestCompletedTasks),
    call(onDeleteCompanyMember),
    call(getCompanySearchResultsAsyncHandler),
    call(requestToJoinCompanyAsyncHandler),
    call(getCompanyPublicInformationHandler),
  ]);
}
