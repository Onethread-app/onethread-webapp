import {
  ASSIGN_MEMBER_START,
  ASSIGN_MEMBER_SUCCESS,
  ASSIGN_MEMBER_FAILURE,
  DELETE_MEMBER_START,
  DELETE_MEMBER_SUCCESS,
  DELETE_MEMBER_FAILURE,

  GET_ALL_MEMBER_START,
  GET_ALL_MEMBER_SUCCESS,
  GET_ALL_MEMBER_FAILURE,
} from './Types';

import { ITaskMember } from './Reducer';

export const addTaskMember = (members: string[]) => ({
  type: ASSIGN_MEMBER_START,
  payload: members,
});

export const addTaskMemberSuccess = (response: any) => ({
  type: ASSIGN_MEMBER_SUCCESS,
  payload: response,
});

export const addTaskMemberFailure = (errorMessage: any) => ({
  type: ASSIGN_MEMBER_FAILURE,
  payload: errorMessage,
});

export const getAllMembers = () => ({
  type: GET_ALL_MEMBER_START,
});

export const getAllMembersSuccess = (response: any) => ({
  type: GET_ALL_MEMBER_SUCCESS,
  payload: response,
});

export const getAllMembersFailure = (errorMessage: any) => ({
  type: GET_ALL_MEMBER_FAILURE,
  payload: errorMessage,
});

export const deleteMember = (memberId: ITaskMember['_id']) => ({
  type: DELETE_MEMBER_START,
  memberId,
});

export const deleteMemberSuccess = (response: any) => ({
  type: DELETE_MEMBER_SUCCESS,
  payload: response,
});

export const deleteMemberFailure = (errorMessage: any) => ({
  type: DELETE_MEMBER_FAILURE,
  payload: errorMessage,
});
