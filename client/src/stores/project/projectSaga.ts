import { all, put, call, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import {
  tokenConfig,
  tokenConfigFIleUpload,
} from 'stores/UtilsActions';
import { tigrowApi } from 'config';
import {
  PROJECT,
  ProjectActionTypes,
  CLEAR_PROJECT_REDUCER_STATE,
} from './Types';
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
  updateProjectSuccess,
  updateProjectFailure,
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
  updateProjectLoading,
  deleteProjectFailure,
  deleteProjectSuccess,
  getAllUserProjectsSuccess,
  getAllUserProjectsFailure,
  getUserFavouriteProjectsSuccess,
  getUserFavouriteProjectFailure,
  favouriteProjectFailure,
  favouriteProjectSuccess,
  getUserFavouriteProjects,
} from './Actions';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { getCompanyId } from 'stores/company/Selector';
import { CLEAR_ROOMS_REDUCER_STATE_FOR_CHANGE_PROJECT } from 'stores/room/Types';
import { getPendingProjects, getProjectId } from './Selector';
import { IPendingProject } from './Reducer';
import { Toaster } from '@blueprintjs/core';
import {
  getCurrentUserId,
  getUserCompanyList,
} from 'stores/user/Selector';
import { clearCurrentBoard, getAllBoards } from 'stores/task/Actions';
import { returnErrorText } from 'helpers/HandleSagaErrors';

const takeEvery: any = Eff.takeEvery;
const takeLatest: any = Eff.takeLatest;

export function* createProjectAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const reqBody = {
        name: payload.name,
        companyId: payload.companyId,
      };
      yield tigrowApi.post(
        `projects/${payload.companyId}/create-project`,
        reqBody,
        headers,
      );
      yield all([put(createProjectSuccess()), put(getAllProjects())]);
    }
  } catch (error) {
    yield put(createProjectFailure(returnErrorText(error)));
  }
}

export function* getAllProjectsAsync() {
  try {
    yield put(showLoading());
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
    yield put(getAllProjectsFailure(returnErrorText(error)));
  } finally {
    yield put(hideLoading());
  }
}

export function* createProjectInCompanyAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    const companyId = payload.companyId
      ? payload.companyId
      : yield select(getCompanyId);
    if ((headers as any).headers.Authorization) {
      const reqBody = {
        name: payload.name,
        color: payload.color,
        deadline: payload.deadline ? payload.deadline : undefined,
        companyId,
        budget: payload.budget ?? 0,
      };
      yield tigrowApi.post(
        `projects/create-project`,
        reqBody,
        headers,
      );
      yield all([
        put(createProjectInCompanySuccess()),
        put(getAllProjects()),
      ]);
    }
  } catch (error) {
    yield put(createProjectInCompanyFailure(returnErrorText(error)));
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
    yield put(archiveProjectFailure(returnErrorText(error)));
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

      yield all([
        put(unarchiveProjectSuccess(response.data.project)),
        put(getAllProjects()),
        put(getProjectArchive()),
      ]);
    }
  } catch (error) {
    yield put(unarchiveProjectFailure(returnErrorText(error)));
  }
}

export function* deleteProjectAsync({ payload }: any) {
  try {
    yield put(showLoading());
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      yield tigrowApi.delete(
        `/projects/delete-project?pid=${payload}`,
        headers,
      );
      yield all([
        put(deleteProjectSuccess(payload)),
        put(getAllProjects()),
        put(getProjectArchive()),
      ]);
    }
  } catch (error) {
    yield put(deleteProjectFailure(returnErrorText(error)));
  } finally {
    yield put(hideLoading());
  }
}

export function* getArchivedProjectsAsync() {
  try {
    yield put(showLoading());
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
    yield put(getProjectArchiveFailure(returnErrorText(error)));
  } finally {
    yield put(hideLoading());
  }
}

export function* updateProjectAsync({
  projectName,
  projectId,
  color,
  deadline,
}: any) {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const reqBody = {
        name: projectName,
        color: color,
        deadline: deadline,
      };
      const response = yield tigrowApi.put(
        `projects/change-title?pid=${projectId}`,
        reqBody,
        headers,
      );
      yield all([
        put(updateProjectSuccess(response.data)),
        put(getAllProjects()),
      ]);
    }
  } catch (error) {
    yield put(updateProjectFailure(returnErrorText(error)));
  }
}

export function* getSingleProjectAsync({ payload }: any) {
  try {
    if (payload) {
      yield put(showLoading());
      yield all([
        put({
          type: CLEAR_ROOMS_REDUCER_STATE_FOR_CHANGE_PROJECT,
        }),
        put(clearCurrentBoard()),
      ]);
      const headers = tokenConfig();
      if ((headers as any).headers.Authorization) {
        const response = yield tigrowApi.get(
          `projects?pid=${payload}`,
          headers,
        );
        yield all([
          put(getSingleProjectSuccess(response.data)),
          put(getRoleForProject(response.data._id)),
          put(openProjectFIle(true)),
        ]);
      }
    } else {
      yield put(updateProjectLoading(false));
    }
  } catch (error) {
    yield all([
      put(setProjectAccessForUser(false)),
      put(getSingleProjectFailure(returnErrorText(error))),
    ]);
  } finally {
    yield put(hideLoading());
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
    yield put(
      projectPrefaceDescriptionUpdateFailure(returnErrorText(error)),
    );
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
    yield put(
      projectPrefaceOutlineUpdateFailure(returnErrorText(error)),
    );
  }
}

export function* projectFileUploadAsync({ file, pid }: any) {
  try {
    const headers = tokenConfigFIleUpload();
    const projectId = yield select(getProjectId);
    if ((headers as any).headers.Authorization) {
      yield tigrowApi.post(
        `files/file-upload-project?pid=${projectId}`,
        file,
        headers,
      );
      yield all([
        put(projectFileUploadSuccess()),
        put(getSingleProject(projectId)),
      ]);
    }
  } catch (error) {
    yield put(projectFileUploadFailure(returnErrorText(error)));
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
    yield put(getAllPendingProjectsFailure(returnErrorText(error)));
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
    yield put(acceptPendingProjectFailure(returnErrorText(error)));
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
    yield put(rejectPendingProjectFailure(returnErrorText(error)));
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
    yield put(updateProjectRoleFailure(returnErrorText(error)));
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
    yield put(getRoleForProjectFailure(returnErrorText(error)));
  }
}

export function* getProjectTeamsAsync() {
  try {
    const headers = tokenConfig();
    const pid = yield select(getProjectId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `/teams/member-list?pid=${pid}`,
        headers,
      );
      yield put(getProjectTeamsSuccess(response.data.memberList));
    }
  } catch (error) {
    yield put(getProjectTeamsFailure(returnErrorText(error)));
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
    yield put(addProjectTeamsFailure(returnErrorText(error)));
  }
}

export function* getProjectAssociatesAsync() {
  try {
    const headers = tokenConfig();
    const pid = yield select(getProjectId);
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
    yield put(getProjectAssociatesFailure(returnErrorText(error)));
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
    yield put(addProjectAssociateFailure(returnErrorText(error)));
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
    yield put(changeProjectMemberRoleFailure(returnErrorText(error)));
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
      // eslint-disable-next-line array-callback-return
      yield list.map((l: any) => {
        tigrowApi
          .get(`projects/project-list/${l._id}`, headers)
          .then((res) => {
            // eslint-disable-next-line array-callback-return
            res.data.map((m: any) => {
              call(getProjectsIndividualSuccess, m.project);
            });
          });
      });
    }
  } catch (error) {
    yield put(getProjectsIndividualFailure(returnErrorText(error)));
  }
}

export function* deleteTeamMemberAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    const projectId = yield select(getProjectId);
    if ((headers as any).headers.Authorization) {
      tigrowApi.delete(
        `projects/${projectId}/teams/${payload}`,
        headers,
      );
      yield put(deleteTeamMemberSuccess(payload));
    }
  } catch (error) {
    yield put(deleteTeamMemberFailure(returnErrorText(error)));
  }
}

export function* getAllUserProjectsAsync() {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(`projects/lists`, headers);
      yield put(getAllUserProjectsSuccess(response.data));
    }
  } catch (error) {
    yield put(getAllUserProjectsFailure(returnErrorText(error)));
  }
}

export function* getFavouriteUserProjectsAsync() {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `projects/favourite-list`,
        headers,
      );
      yield put(getUserFavouriteProjectsSuccess(response.data));
    }
  } catch (error) {
    yield put(getUserFavouriteProjectFailure(returnErrorText(error)));
  }
}

export function* favouriteProjectAsync(action: {
  payload: { pid: string; member: string; isFavourite: boolean };
}) {
  try {
    const headers = tokenConfig();
    const member = action.payload.member;
    if ((headers as any).headers.Authorization) {
      yield tigrowApi.put(
        `projects/favourite?pid=${action.payload.pid}`,
        {
          member,
          isFavourite: action.payload.isFavourite,
        },
        headers,
      );
      yield put(
        favouriteProjectSuccess({
          projectId: action.payload.pid,
          isFavourite: action.payload.isFavourite,
        }),
      );
      yield put(getUserFavouriteProjects());
    }
  } catch (error) {
    yield put(favouriteProjectFailure(returnErrorText(error)));
  }
}

export function* clearProjectReducerAsync() {
  yield put(clearCurrentBoard());
  yield put({ type: CLEAR_PROJECT_REDUCER_STATE });
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

export function* onDeleteProject() {
  yield takeEvery(
    ProjectActionTypes.DELETE_PROJECT_START,
    deleteProjectAsync,
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
    ProjectActionTypes.UPDATE_PROJECT_START,
    updateProjectAsync,
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

export function* onClearProjectReducer() {
  yield takeEvery(
    ProjectActionTypes.CLEAR_PROJECT_REDUCER,
    clearProjectReducerAsync,
  );
}

export function* onDeleteTeamMember() {
  yield takeEvery(
    ProjectActionTypes.DELETE_TEAM_MEMBER_START,
    deleteTeamMemberAsync,
  );
}

export function* onGetAllUserProjects() {
  yield takeLatest(
    ProjectActionTypes.GET_ALL_USER_PROJECTS_START,
    getAllUserProjectsAsync,
  );
}

export const deleteTeamMemberSuccess = (response: any) => ({
  type: ProjectActionTypes.DELETE_TEAM_MEMBER_SUCCESS,
  payload: response,
});

export const deleteTeamMemberFailure = (errorMessage: any) => ({
  type: ProjectActionTypes.DELETE_TEAM_MEMBER_FAILURE,
  payload: errorMessage,
});

export function* getFavouriteUserProjectsHandler() {
  yield takeLatest(
    ProjectActionTypes.GET_ALL_FAVOURITE_PROJECTS_START,
    getFavouriteUserProjectsAsync,
  );
}

export function* favouriteProjectHandler() {
  yield takeEvery(
    ProjectActionTypes.FAVOURITE_PROJECT,
    favouriteProjectAsync,
  );
}

export default function* projectSaga() {
  yield all([
    call(onCreateProject),
    call(onGetAllProject),
    call(onCreateProjectInCompany),
    call(onArchiveProject),
    call(onUnarchiveProject),
    call(onDeleteProject),
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
    call(onClearProjectReducer),
    call(onDeleteTeamMember),
    call(onGetAllUserProjects),
    call(getFavouriteUserProjectsHandler),
    call(favouriteProjectHandler),
  ]);
}
