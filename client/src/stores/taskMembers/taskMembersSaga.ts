import { all, put, call } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import { formTokenConfig } from 'stores/UtilsActions';
import { tigrowApi } from 'config';
import { isEmpty } from 'lodash';
import {
  ASSIGN_MEMBER_START,
  DELETE_MEMBER_START,
  GET_ALL_MEMBER_START,
} from './Types';
import {
  getAllMembersSuccess,
  getAllMembersFailure,
  deleteMemberSuccess,
  deleteMemberFailure,
  addTaskMemberSuccess,
  addTaskMemberFailure,
} from './Action';
import { returnErrorText } from 'helpers/HandleSagaErrors';

const takeLatest: any = Eff.takeLatest;

export function* addTaskMemberAsync({ payload }: any) {
  try {
    const { taskId, projectId, companyId, assignmembers } = payload;
    const headers = formTokenConfig(companyId);
    let response;
    if ((headers as any).headers.Authorization) {
      const reqBody = { assignmembers };
      response = yield tigrowApi.post(
        `tasks/member/${taskId}?pid=${projectId}`,
        reqBody,
        headers,
      );
      const responseData = response.data.map((assigned: any) => {
        if (isEmpty(assigned.assignedPerson.profileImage)) {
          return {
            _id: assigned._id,
            name:
              assigned.assignedPerson.firstName +
              ' ' +
              assigned.assignedPerson.lastName,
            account:
              assigned.account.firstName +
              ' ' +
              assigned.account.lastName,
            profileImage: '',
          };
        } else {
          return {
            _id: assigned._id,
            name:
              assigned.assignedPerson.firstName +
              ' ' +
              assigned.assignedPerson.lastName,
            account:
              assigned.account.firstName +
              ' ' +
              assigned.account.lastName,
            profileImage: assigned.assignedPerson.profileImage,
          };
        }
      });
      yield put(addTaskMemberSuccess(responseData));
    }
    return addTaskMemberFailure(response);
  } catch (error) {
    return addTaskMemberFailure(returnErrorText(error));
  }
}

export function* getAllMembersAsync({ payload }: any) {
  try {
    const { companyId, taskId } = payload;
    const headers = formTokenConfig(companyId);
    if ((headers as any).headers.Authorization) {
      const response = yield tigrowApi.get(
        `tasks/member/${taskId}`,
        headers,
      );
      yield put(getAllMembersSuccess(response.data));
    }
  } catch (error) {
    yield put(getAllMembersFailure(returnErrorText(error)));
  }
}

export function* deleteMemberAsync({ payload }: any) {
  try {
    const { taskId, projectId, companyId, assignedMemberId } =
      payload;
    const headers = formTokenConfig(companyId);
    if ((headers as any).headers.Authorization && payload) {
      const response = yield tigrowApi.delete(
        `tasks/member/${taskId}?pid=${projectId}&assignedMemberid=${assignedMemberId}`,
        headers,
      );
      if (response.status === 200) {
        yield put(deleteMemberSuccess(assignedMemberId));
      }
    }
  } catch (error) {
    yield put(deleteMemberFailure(returnErrorText(error)));
  }
}

export function* onAddTaskMember() {
  yield takeLatest(ASSIGN_MEMBER_START, addTaskMemberAsync);
}

export function* onGetAllMembers() {
  yield takeLatest(GET_ALL_MEMBER_START, getAllMembersAsync);
}

export function* onDeleteMember() {
  yield takeLatest(DELETE_MEMBER_START, deleteMemberAsync);
}

export default function* taskMembersSaga() {
  yield all([
    call(onGetAllMembers),
    call(onDeleteMember),
    call(onAddTaskMember),
  ]);
}
