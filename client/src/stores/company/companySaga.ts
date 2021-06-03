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
} from './Actions';
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
    if (error.message === 'Network Error') {
      yield put(createCompanyActionFailure('Network error'));
    } else if (error.response.status === 409) {
      yield put(createCompanyActionFailure('Duplicate Company Name'));
    } else {
      // tslint:disable-next-line: no-console
      
    }
  }
}

export function* getCompanyDetailsAsync({ payload }: any) {
  try {
    const currentCompanyName = yield select(getCompanyName);
    if (payload !== currentCompanyName) {
      const headers = tokenConfig();
      yield put(clearCompanyError());

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
    if (error.message === 'Network Error') {
      yield put(getCompanyDetailsFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        getCompanyDetailsFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      
      yield put(getCompanyDetailsFailure(error.message));
    }
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
    if (error.message === 'Network Error') {
      yield put(getCompanyMembersFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        getCompanyMembersFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      
      yield put(getCompanyMembersFailure(error.message));
    }
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
    if (error.message === 'Network Error') {
      yield put(addTeamMembersFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        addTeamMembersFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      
      yield put(addTeamMembersFailure(error.message));
    }
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
    if (error.message === 'Network Error') {
      yield put(deleteCompanyMemberFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        deleteCompanyMemberFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      
      yield put(deleteCompanyMemberFailure(error.message));
    }
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
    if (error.message === 'Network Error') {
      yield put(addDepartmentFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        addDepartmentFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      
      yield put(addDepartmentFailure(error.message));
    }
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
    if (error.message === 'Network Error') {
      yield put(getAllDepartmentsFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        getAllDepartmentsFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      
      yield put(getAllDepartmentsFailure(error.message));
    }
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
    if (error.message === 'Network Error') {
      yield put(editCompanyInfoActionFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        editCompanyInfoActionFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      
      yield put(editCompanyInfoActionFailure(error.message));
    }
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
    if (error.message === 'Network Error') {
      yield put(changeCompanyNameFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        changeCompanyNameFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      
      yield put(changeCompanyNameFailure(error.message));
    }
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
    if (error.message === 'Network Error') {
      yield put(companyLogoUploadActionFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        companyLogoUploadActionFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      
      yield put(companyLogoUploadActionFailure(error.message));
    }
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
      yield put(addDesignationSuccess());
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(addDesignationFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        addDesignationFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      
      yield put(addDesignationFailure(error.message));
    }
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
      yield put(editDesignationSuccess());
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(editDesignationFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        editDesignationFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      
      yield put(editDesignationFailure(error.message));
    }
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
    if (error.message === 'Network Error') {
      yield put(changeMemberRoleFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        changeMemberRoleFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      
      yield put(changeMemberRoleFailure(error.message));
    }
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
    if (error.message === 'Network Error') {
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
      yield put(changeMemberRoleFailure('Network Error'));
    } else {
      Toaster.create().show({
        message: error.response.data.errors[0].message,
        intent: 'danger',
        timeout: 300000,
      });
      // tslint:disable-next-line: no-console
      
      yield put(changeMemberRoleFailure(error.message));
    }
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
    if (error.message === 'Network Error') {
      yield put(getCompanyPendingMembersFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        getCompanyPendingMembersFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      
      yield put(getCompanyPendingMembersFailure(error.message));
    }
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
    if (error.message === 'Network Error') {
      yield put(addCertificateFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        addCertificateFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      
      yield put(addCertificateFailure(error.message));
    }
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
    if (error.message === 'Network Error') {
      yield put(addOrganizationFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        addOrganizationFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      
      yield put(addOrganizationFailure(error.message));
    }
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
    if (error.message === 'Network Error') {
      yield put(editOrganizationFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        editOrganizationFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      
      yield put(editOrganizationFailure(error.message));
    }
  }
}

export function* getAllCompanyAnnouncementAsync() {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `company/${companyId}/announcements`,
        headers,
      );
      yield put(
        getCompanyAnnouncementSuccess(response.data.announce),
      );
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(getCompanyAnnouncementFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        getCompanyAnnouncementFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      
      yield put(getCompanyAnnouncementFailure(error.message));
    }
  }
}

export function* addAnnouncementAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    const announce = {
      text: payload,
    };
    if ((headers as any).headers.Authorization) {
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
    if (error.message === 'Network Error') {
      yield put(addAnnouncementFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        addAnnouncementFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      
      yield put(addAnnouncementFailure(error.message));
    }
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
    if (error.message === 'Network Error') {
      yield put(getAllProductFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        getAllProductFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      
      yield put(getAllProductFailure(error.message));
    }
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
      }
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(inviteColleagueInBulkFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        inviteColleagueInBulkFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      
      yield put(inviteColleagueInBulkFailure(error.message));
    }
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
    if (error.message === 'Network Error') {
      yield put(editCertificateFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        editCertificateFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      
      yield put(editCertificateFailure(error.message));
    }
  }
}

export function* getLatestCompletedTasksAsync() {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `company/${companyId}/latest-completed-tasks`,
        headers,
      );
      yield put(getLatestCompletedTasksSuccess(response.data.data));
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(getLatestCompletedTasksFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        getLatestCompletedTasksFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      
      yield put(getLatestCompletedTasksFailure(error.message));
    }
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
    CompanyActionTypes.DELETE_TEAM_MEMBER_START,
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
  ]);
}
