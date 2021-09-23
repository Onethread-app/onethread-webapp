import {
  all, put, call, select,
} from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import { tokenConfig } from 'stores/UtilsActions';
import { tigrowApi } from 'config';
import { isEmpty } from 'lodash';
import { returnErrorText } from 'helpers/HandleSagaErrors';
import {
  ASSIGN_MEMBER_START,
  DELETE_MEMBER_START,
  GET_ALL_MEMBER_START,
} from './Types';
import { getCurrentTaskId, getProjectDetailsId } from './Selector';
import {
  getAllMembersSuccess,
  getAllMembersFailure,
  deleteMemberSuccess,
  deleteMemberFailure,
  addTaskMemberSuccess,
  addTaskMemberFailure,
} from './Action';

const { takeLatest } = Eff;

export function* addTaskMemberAsync({ payload }: any) {
  try {
    const headers = tokenConfig();
    let response;
    const taskId = yield select(getCurrentTaskId);
    const projectId = yield select(getProjectDetailsId);
    if ((headers as any).headers.Authorization) {
      const reqBody = { assignmembers: payload };
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
              `${assigned.assignedPerson.firstName
              } ${
                assigned.assignedPerson.lastName}`,
            account:
              `${assigned.account.firstName
              } ${
                assigned.account.lastName}`,
            profileImage: '',
          };
        }
        return {
          _id: assigned._id,
          name:
              `${assigned.assignedPerson.firstName
              } ${
                assigned.assignedPerson.lastName}`,
          account:
              `${assigned.account.firstName
              } ${
                assigned.account.lastName}`,
          profileImage: assigned.assignedPerson.profileImage,
        };
      });
      yield put(addTaskMemberSuccess(responseData));
    }
    return addTaskMemberFailure(response);
  } catch (error) {
    return addTaskMemberFailure(returnErrorText(error));
  }
}

export function* onAddTaskMember() {
  yield takeLatest(ASSIGN_MEMBER_START, addTaskMemberAsync);
}

export function* getAllMembersAsync() {
  try {
    const headers = tokenConfig();
    const taskId = yield select(getCurrentTaskId);
    const projectId = yield select(getProjectDetailsId);
    if (taskId && projectId) {
      if ((headers as any).headers.Authorization) {
        const response = yield tigrowApi.get(
          `tasks/member/${taskId}?pid=${projectId}`,
          headers,
        );
        const responseData = response.data.map((assigned: any) => {
          if (isEmpty(assigned.assignedPerson.profileImage)) {
            return {
              _id: assigned._id,
              name:
                `${assigned.assignedPerson.firstName
                } ${
                  assigned.assignedPerson.lastName}`,
              account:
                `${assigned.account.firstName
                } ${
                  assigned.account.lastName}`,
              profileImage: '',
            };
          }
          return {
            _id: assigned._id,
            name:
                `${assigned.assignedPerson.firstName
                } ${
                  assigned.assignedPerson.lastName}`,
            account:
                `${assigned.account.firstName
                } ${
                  assigned.account.lastName}`,
            profileImage: assigned.assignedPerson.profileImage,
          };
        });
        yield put(getAllMembersSuccess(responseData));
      }
    } else {
      yield put(
        getAllMembersFailure('Task ID or Project ID not found'),
      );
    }
  } catch (error) {
    yield put(getAllMembersFailure(returnErrorText(error)));
  }
}

export function* onGetAllMembers() {
  yield takeLatest(GET_ALL_MEMBER_START, getAllMembersAsync);
}

export function* deleteMemberAsync({ memberId }: any) {
  try {
    const headers = tokenConfig();
    const projectId = yield select(getProjectDetailsId);
    if ((headers as any).headers.Authorization) {
      const taskId = yield select(getCurrentTaskId);
      yield tigrowApi.delete(
        `tasks/member/${taskId}?assignedMemberid=${memberId}&pid=${projectId}`,
        headers,
      );
      yield put(deleteMemberSuccess(memberId));
    }
  } catch (error) {
    yield put(deleteMemberFailure(returnErrorText(error)));
  }
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
