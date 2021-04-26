import { all, put, call, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import {
  tokenConfig,
  tokenConfigFIleUpload,
} from 'stores/UtilsActions';
import { tigrowApi } from 'config';
import { PROJECT, ProjectActionTypes } from './Types';
import {
  createProjectSuccess,
  createProjectFailure,
  getAllProjects,
  getAllProjectsSuccess,
  getAllProjectsFailure,
  createProjectInCompanySuccess,
  createProjectInCompanyFailure,
  archiveProjectSuccess,
  archiveProjectFailure,
  getProjectArchiveSuccess,
  getProjectArchiveFailure,
  updateProjectNameSuccess,
  updateProjectNameFailure,
  getSingleProjectSuccess,
  getSingleProjectFailure,
  openProjectFIle,
  projectPrefaceDescriptionUpdateSuccess,
  projectPrefaceDescriptionUpdateFailure,
  projectPrefaceOutlineUpdateSuccess,
  projectPrefaceOutlineUpdateFailure,
  getSingleProject,
  projectFileUploadSuccess,
  projectFileUploadFailure,
  getAllPendingProjectsSuccess,
  getAllPendingProjectsFailure,
  addProject,
  acceptPendingProjectSuccess,
  acceptPendingProjectFailure,
  rejectPendingProjectSuccess,
  rejectPendingProjectFailure,
  updateProjectRoleSuccess,
  getRoleForProject,
  updateProjectRoleFailure,
  getRoleForProjectSuccess,
  getRoleForProjectFailure,
  getProjectTeamsSuccess,
  getProjectTeamsFailure,
  getProjectTeams,
  addProjectTeamsSuccess,
  addProjectTeamsFailure,
  getProjectAssociatesSuccess,
  getProjectAssociatesFailure,
  getProjectAssociates,
  addProjectAssociateSuccess,
  addProjectAssociateFailure,
  changeProjectMemberRoleSuccess,
  changeProjectMemberRoleFailure,
  getProjectsIndividualSuccess,
  getProjectsIndividualFailure,
  setProjectAccessForUser,
  unarchiveProjectFailure,
  unarchiveProjectSuccess,
  getProjectArchive,
} from './Actions';
import { getCompanyId } from 'stores/company/Selector';
import { CLEAR_ROOMS_REDUCER_STATE_FOR_CHANGE_PROJECT } from 'stores/room/Types';
import {
  getCurrentProjectId,
  getPendingProjects,
  getProjectId,
} from './Selector';
import { IPendingProject } from './Reducer';
import { Toaster } from '@blueprintjs/core';
import {
  getCurrentUserId,
  getUserCompanyList,
} from 'stores/user/Selector';
import {
  clearCurrentBoard,
  getAllBoards,
} from 'stores/board/Actions';
import handleError from 'helpers/HandleSagaErrors';

const takeEvery: any = Eff.takeEvery;
const takeLatest: any = Eff.takeLatest;

export function* createProjectAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const reqBody = {
        name: payload.name,
        companyId: payload.company,
      };

      yield tigrowApi.post(
        `projects/${payload.company}/create-project`,
        reqBody,
        headers,
      );
      yield all([put(createProjectSuccess()), put(getAllProjects())]);
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(createProjectFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        createProjectFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(createProjectFailure(error.message));
    }
  }
}

export function* getAllProjectsAsync() {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `projects/${companyId}/lists`,
        headers,
      );
      yield put(getAllProjectsSuccess(response.data));
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(getAllProjectsFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        getAllProjectsFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(getAllProjectsFailure(error.message));
    }
  }
}

export function* createProjectInCompanyAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    if ((headers as any).headers.Authorization) {
      const reqBody = {
        name: payload.name,
        concernedAdmin: {
          memberId: payload.admin.memberId,
          accountId: payload.admin._id,
        },
        color: payload.color,
        department: payload.department,
        associates: payload.associates,
        companyId,
      };
      yield tigrowApi.post(
        `projects/${companyId}/create`,
        reqBody,
        headers,
      );
      yield all([
        put(createProjectInCompanySuccess()),
        put(getAllProjects()),
      ]);
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(createProjectInCompanyFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        createProjectInCompanyFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(createProjectInCompanyFailure(error.message));
    }
  }
}

export function* archiveProjectAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      yield tigrowApi.put(
        `projects/archive?pid=${payload}`,
        null,
        headers,
      );
      yield all([
        put(archiveProjectSuccess()),
        put(getAllProjects()),
        put(getProjectArchive()),
      ]);
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(archiveProjectFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        archiveProjectFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(archiveProjectFailure(error.message));
    }
  }
}

export function* unarchiveProjectAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.put(
        `projects/unarchive?pid=${payload}`,
        null,
        headers,
      );
      console.log(response);
      yield all([
        put(unarchiveProjectSuccess(response.data.project)),
        put(getAllProjects()),
        put(getProjectArchive()),
      ]);
    }
  } catch (error) {
    handleError(error, async (errorMessage: any) => {
      await unarchiveProjectFailure(errorMessage);
    });
  }
}

export function* getArchivedProjectsAsync() {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `projects/${companyId}/archive-list`,
        headers,
      );
      yield put(getProjectArchiveSuccess(response.data));
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(getProjectArchiveFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        getProjectArchiveFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(getProjectArchiveFailure(error.message));
    }
  }
}

export function* updateProjectNameAsync({
  projectName,
  projectId,
  color,
}: any) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const reqBody = {
        name: projectName,
        color: color,
      };
      const response = yield tigrowApi.put(
        `projects/change-title?pid=${projectId}`,
        reqBody,
        headers,
      );
      yield all([
        put(updateProjectNameSuccess(response.data)),
        put(getAllProjects()),
      ]);
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(updateProjectNameFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        updateProjectNameFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(updateProjectNameFailure(error.message));
    }
  }
}

export function* getSingleProjectAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `projects?pid=${payload}`,
        headers,
      );
      yield all([
        put({
          type: CLEAR_ROOMS_REDUCER_STATE_FOR_CHANGE_PROJECT,
        }),
        put(clearCurrentBoard()),
        put(getSingleProjectSuccess(response.data)),
      ]);
      const projectId = yield select(getProjectId);
      yield projectId !== '' && put(openProjectFIle(true));
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(getSingleProjectFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        getSingleProjectFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else if (error.response.status === 403) {
      yield all([
        put(setProjectAccessForUser(false)),
        put(getSingleProjectFailure(error.message)),
      ]);
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(getSingleProjectFailure(error.message));
    }
  }
}

export function* projectPrefaceDescriptionUpdateAsync({
  pid,
  description,
}: any) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const reqBody = {
        description,
      };
      yield tigrowApi.put(
        `projects/description?pid=${pid}`,
        reqBody,
        headers,
      );
      yield put(projectPrefaceDescriptionUpdateSuccess());
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(
        projectPrefaceDescriptionUpdateFailure('Network Error'),
      );
    } else if (error.response.status === 401) {
      yield put(
        projectPrefaceDescriptionUpdateFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(
        projectPrefaceDescriptionUpdateFailure(error.message),
      );
    }
  }
}

export function* projectPrefaceOutlineUpdateAsync({
  pid,
  outline,
}: any) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const reqBody = {
        outline,
      };
      yield tigrowApi.put(
        `projects/outline?pid=${pid}`,
        reqBody,
        headers,
      );
      yield put(projectPrefaceOutlineUpdateSuccess());
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(projectPrefaceOutlineUpdateFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        projectPrefaceOutlineUpdateFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(projectPrefaceOutlineUpdateFailure(error.message));
    }
  }
}

export function* projectFileUploadAsync({ file, pid }: any) {
  try {
    const headers = tokenConfigFIleUpload();
    const projectId = yield select(getProjectId);
    console.log(file);
    if ((headers as any).headers.Authorization) {
      yield tigrowApi.post(
        `files/file-upload-project?pid=${pid}`,
        file,
        headers,
      );
      yield all([
        put(projectFileUploadSuccess()),
        put(getSingleProject(projectId)),
      ]);
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(projectFileUploadFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        projectFileUploadFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(projectFileUploadFailure(error.message));
    }
  }
}

export function* getAllPendingProjectsAsync() {
  try {
    const headers = tokenConfig();

    if ((headers as any).headers.Authorization) {
      const companyId = yield select(getCompanyId);
      const response = yield tigrowApi.get(
        `projects/${companyId}/pending-requests`,
        headers,
      );
      yield put(getAllPendingProjectsSuccess(response.data));
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(getAllPendingProjectsFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        getAllPendingProjectsFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(getAllPendingProjectsFailure(error.message));
    }
  }
}

export function* acceptPendingProjectAsync({ pending }: any) {
  try {
    const headers = tokenConfig();
    const companyID = yield select(getCompanyId);
    const pendingProjects = yield select(getPendingProjects);
    if (
      (headers as any).headers.Authorization &&
      pending.project._id
    ) {
      const reqBody = {
        size: pending.size,
        associate: pending.associate,
      };
      const response = yield tigrowApi.put(
        `projects/${companyID}/accept-request?pid=${pending.project._id}`,
        reqBody,
        headers,
      );

      if (response.status === 200) {
        const currentPendingProjects = pendingProjects.filter(
          (pendingProject: IPendingProject) =>
            pendingProject.project._id !== pending.project._id,
        );
        yield all([
          put(acceptPendingProjectSuccess()),
          put(getAllPendingProjectsSuccess(currentPendingProjects)),
          put(addProject(pending.project)),
        ]);
        Toaster.create().show({
          message: `Successfully accepted`,
          timeout: 3000,
          intent: 'success',
        });
      }
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(acceptPendingProjectFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        acceptPendingProjectFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(acceptPendingProjectFailure(error.message));
    }
  }
}

export function* rejectPendingProjectAsync({ projectId }: any) {
  try {
    const headers = tokenConfig();
    const companyID = yield select(getCompanyId);
    const pendingProjects = yield select(getPendingProjects);
    if ((headers as any).headers.Authorization && projectId) {
      const response = yield tigrowApi.put(
        `projects/${companyID}/reject-request?pid=${projectId}`,
        null,
        headers,
      );

      if (response.status === 200) {
        const currentPendingProjects = pendingProjects.filter(
          (pending: IPendingProject) =>
            pending.project._id !== projectId,
        );
        yield all([
          put(rejectPendingProjectSuccess()),
          put(getAllPendingProjectsSuccess(currentPendingProjects)),
        ]);
        Toaster.create().show({
          message: `Successfully rejected`,
          timeout: 3000,
          intent: 'success',
        });
      }
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(rejectPendingProjectFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        rejectPendingProjectFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(rejectPendingProjectFailure(error.message));
    }
  }
}

export function* updateProjectRoleAsync({ optionalRole }: any) {
  try {
    const headers = tokenConfig();
    const companyId = yield select(getCompanyId);
    const projectId = yield select(getProjectId);
    if ((headers as any).headers.Authorization) {
      const reqBody = {
        optionalRole,
      };
      yield tigrowApi.put(
        `projects/${companyId}/role?pid=${projectId}`,
        reqBody,
        headers,
      );
      yield all([
        put(getRoleForProject(projectId)),
        put(updateProjectRoleSuccess()),
      ]);
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(updateProjectRoleFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        updateProjectRoleFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(updateProjectRoleFailure(error.message));
    }
  }
}

export function* getRoleForProjectAsync({ projectId }: any) {
  try {
    const headers = tokenConfig();
    const userId = yield select(getCurrentUserId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `projects/individual/${userId}?pid=${projectId}`,
        headers,
      );
      yield put(getRoleForProjectSuccess(response.data));
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(getRoleForProjectFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        getRoleForProjectFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(getRoleForProjectFailure(error.message));
    }
  }
}

export function* getProjectTeamsAsync() {
  try {
    const headers = tokenConfig();
    const pid = yield select(getCurrentProjectId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `/teams/member-list?pid=${pid}`,
        headers,
      );
      yield put(getProjectTeamsSuccess(response.data.memberList));
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(getProjectTeamsFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        getProjectTeamsFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(getProjectTeamsFailure(error.message));
    }
  }
}

export function* addProjectTeamsAsync({ data }: any) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.post(
        `/teams/${data.company}/add-team-member?pid=${data.project}`,
        { members: data.members },
        headers,
      );
      if (response.status === 201) {
        yield all([
          put(addProjectTeamsSuccess()),
          put(getProjectTeams()),
          put(getAllBoards()),
        ]);
      }
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(addProjectTeamsFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        addProjectTeamsFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(addProjectTeamsFailure(error.message));
    }
  }
}

export function* getProjectAssociatesAsync() {
  try {
    const headers = tokenConfig();
    const pid = yield select(getCurrentProjectId);
    const companyId = yield select(getCompanyId);
    if ((headers as any).headers.Authorization) {
      // tslint:disable-next-line:no-string-literal
      headers['companyid'] = companyId;
      const response = yield tigrowApi.get(
        `/teams/associate-list?pid=${pid}`,
        headers,
      );
      yield put(getProjectAssociatesSuccess(response.data));
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(getProjectAssociatesFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        getProjectAssociatesFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(getProjectAssociatesFailure(error.message));
    }
  }
}

export function* addProjectAssociateAsync({ data }: any) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.put(
        `/projects/${data.company}/add-associates?pid=${data.project}`,
        {
          associates: data.associates,
        },
        headers,
      );
      if (response.status === 200) {
        yield all([
          put(getProjectAssociates()),
          put(addProjectAssociateSuccess()),
        ]);
      }
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(addProjectAssociateFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        addProjectAssociateFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(addProjectAssociateFailure(error.message));
    }
  }
}

export function* changeProjectMemberRoleAsync({
  values,
  memberId,
  accountId,
}: any) {
  try {
    const headers = tokenConfig();
    const userId = yield select(getCurrentUserId);
    const projectId = yield select(getProjectId);
    if ((headers as any).headers.Authorization) {
      yield tigrowApi.put(
        `/teams/${memberId}/change-role?pid=${projectId}`,
        values,
        headers,
      );
      if (userId === accountId) {
        yield put(getRoleForProject(projectId));
      }
      yield all([
        put(
          changeProjectMemberRoleSuccess({
            memberId,
            role: values.role,
          }),
        ),
        put(getSingleProject(projectId)),
      ]);
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(changeProjectMemberRoleFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        changeProjectMemberRoleFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(changeProjectMemberRoleFailure(error.message));
    }
  }
}

export function* getProjectsIndividualAsync() {
  try {
    yield put({
      type: PROJECT.PROJECT_LIST_CLEAR,
    });
    const headers = tokenConfig();
    const list = yield select(getUserCompanyList);
    if ((headers as any).headers.Authorization) {
      yield list.map((l: any) => {
        tigrowApi
          .get(`projects/project-list/${l._id}`, headers)
          .then((res) => {
            res.data.map((m: any) => {
              call(getProjectsIndividualSuccess, m.project);
            });
          });
      });
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      yield put(getProjectsIndividualFailure('Network Error'));
    } else if (error.response.status === 401) {
      yield put(
        getProjectsIndividualFailure(
          'Unauthorized user. Please enter valid email and password.',
        ),
      );
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      yield put(getProjectsIndividualFailure(error.message));
    }
  }
}

export function* onCreateProject() {
  yield takeEvery(
    ProjectActionTypes.CREATE_PROJECT_START,
    createProjectAsync,
  );
}

export function* onGetAllProject() {
  yield takeLatest(
    ProjectActionTypes.GET_ALL_PROJECTS_START,
    getAllProjectsAsync,
  );
}

export function* onCreateProjectInCompany() {
  yield takeEvery(
    ProjectActionTypes.CREATE_PROJECT_IN_COMPANY_START,
    createProjectInCompanyAsync,
  );
}

export function* onArchiveProject() {
  yield takeEvery(
    ProjectActionTypes.ARCHIVE_PROJECT_START,
    archiveProjectAsync,
  );
}

export function* onUnarchiveProject() {
  yield takeEvery(
    ProjectActionTypes.UNARCHIVE_PROJECT_START,
    unarchiveProjectAsync,
  );
}

export function* onGetProjectArchive() {
  yield takeLatest(
    ProjectActionTypes.GET_ARCHIVED_PROJECTS_START,
    getArchivedProjectsAsync,
  );
}

export function* onUpdateProjectName() {
  yield takeLatest(
    ProjectActionTypes.UPDATE_PROJECT_NAME_START,
    updateProjectNameAsync,
  );
}

export function* onGetSingleProject() {
  yield takeLatest(
    ProjectActionTypes.GET_SINGLE_PROJECT_START,
    getSingleProjectAsync,
  );
}

export function* onProjectPrefaceDesUp() {
  yield takeLatest(
    ProjectActionTypes.PROJECT_PREFACE_DES_UP_START,
    projectPrefaceDescriptionUpdateAsync,
  );
}

export function* onProjectPrefaceOutUp() {
  yield takeLatest(
    ProjectActionTypes.PROJECT_PREFACE_OUT_UP_START,
    projectPrefaceOutlineUpdateAsync,
  );
}

export function* onProjectFileUpload() {
  yield takeEvery(
    ProjectActionTypes.PROJECT_FILE_UP_START,
    projectFileUploadAsync,
  );
}

export function* onGetAllPendingProjects() {
  yield takeLatest(
    ProjectActionTypes.GET_ALL_PENDING_PROJECT_START,
    getAllPendingProjectsAsync,
  );
}

export function* onAcceptPendingProject() {
  yield takeEvery(
    ProjectActionTypes.ACCEPT_PENDING_PROJECT_START,
    acceptPendingProjectAsync,
  );
}

export function* onRejectPendingProject() {
  yield takeEvery(
    ProjectActionTypes.REJECT_PENDING_PROJECT_START,
    rejectPendingProjectAsync,
  );
}

export function* onUpdateProjectRole() {
  yield takeLatest(
    ProjectActionTypes.UPDATE_PROJECT_ROLE_START,
    updateProjectRoleAsync,
  );
}

export function* onGetRoleForProject() {
  yield takeLatest(
    ProjectActionTypes.GET_PROJECT_ROLE_START,
    getRoleForProjectAsync,
  );
}

export function* onGetProjectTeams() {
  yield takeLatest(
    ProjectActionTypes.GET_PROJECT_TEAMS_START,
    getProjectTeamsAsync,
  );
}

export function* onAddProjectTeams() {
  yield takeEvery(
    ProjectActionTypes.ADD_PROJECT_TEAMS_START,
    addProjectTeamsAsync,
  );
}

export function* onGetProjectAssociates() {
  yield takeLatest(
    ProjectActionTypes.GET_PROJECT_ASSOCIATES_START,
    getProjectAssociatesAsync,
  );
}

export function* onAddProjectAssociate() {
  yield takeEvery(
    ProjectActionTypes.ADD_PROJECT_ASSOCIATES_START,
    addProjectAssociateAsync,
  );
}

export function* onChangeProjectMemberRole() {
  yield takeLatest(
    ProjectActionTypes.UPDATE_PROJECT_MEMBER_ROLE_START,
    changeProjectMemberRoleAsync,
  );
}

export function* onGetIndividualProjectList() {
  yield takeLatest(
    ProjectActionTypes.GET_INDIVIDUAL_PROJECT_LIST_START,
    getProjectsIndividualAsync,
  );
}

export default function* projectSaga() {
  yield all([
    call(onCreateProject),
    call(onGetAllProject),
    call(onCreateProjectInCompany),
    call(onArchiveProject),
    call(onUnarchiveProject),
    call(onGetProjectArchive),
    call(onUpdateProjectName),
    call(onGetSingleProject),
    call(onProjectPrefaceDesUp),
    call(onProjectPrefaceOutUp),
    call(onProjectFileUpload),
    call(onGetAllPendingProjects),
    call(onAcceptPendingProject),
    call(onRejectPendingProject),
    call(onUpdateProjectRole),
    call(onGetRoleForProject),
    call(onGetProjectTeams),
    call(onAddProjectTeams),
    call(onGetProjectAssociates),
    call(onAddProjectAssociate),
    call(onChangeProjectMemberRole),
    call(onGetIndividualProjectList),
  ]);
}
