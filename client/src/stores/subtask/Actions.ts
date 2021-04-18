import { SubtaskActionTypes } from './Types';
import { ISubTask } from './Reducer';

export interface IPayloadForAddingMember {
  _id: string;
  memberId: string;
}
export interface IPayloadForDeletingMember {
  _id: string;
  memberId: string;
}

export const createSubTask = (subTask: ISubTask) => ({
  type: SubtaskActionTypes.CREATE_SUBTASK_START,
  payload: subTask,
});

export const createSubTaskSuccess = (response: any) => ({
  type: SubtaskActionTypes.CREATE_SUBTASK_SUCCESS,
  payload: response,
});

export const createSubTaskFailure = (errorMessage: any) => ({
  type: SubtaskActionTypes.CREATE_SUBTASK_FAILURE,
  payload: errorMessage,
});
export const getAllSubTask = () => ({
  type: SubtaskActionTypes.GET_ALL_SUBTASK_START,
});

export const getAllSubTaskSuccess = (response: any) => ({
  type: SubtaskActionTypes.GET_ALL_SUBTASK_SUCCESS,
  payload: response,
});

export const getAllSubTaskFailure = (errorMessage: any) => ({
  type: SubtaskActionTypes.GET_ALL_SUBTASK_FAILURE,
  payload: errorMessage,
});
export const updateSubTask = (subTask: ISubTask) => ({
  type: SubtaskActionTypes.UPDATE_SUBTASK_START,
  payload: subTask,
});

export const updateSubTaskSuccess = (response: any) => ({
  type: SubtaskActionTypes.UPDATE_SUBTASK_SUCCESS,
  payload: response,
});

export const updateSubTaskFailure = (errorMessage: any) => ({
  type: SubtaskActionTypes.UPDATE_SUBTASK_FAILURE,
  payload: errorMessage,
});

export const addSubTaskMember = (
  payload: IPayloadForAddingMember,
) => ({
  type: SubtaskActionTypes.ADD_SUBTASK_MEMBER_START,
  payload,
});

export const addSubTaskMemberSuccess = (response: any) => ({
  type: SubtaskActionTypes.ADD_SUBTASK_MEMBER_SUCCESS,
  payload: response,
});

export const addSubTaskMemberFailure = (errorMessage: any) => ({
  type: SubtaskActionTypes.ADD_SUBTASK_MEMBER_FAILURE,
  payload: errorMessage,
});

export const deleteSubTaskMember = (
  payload: IPayloadForDeletingMember,
) => ({
  type: SubtaskActionTypes.DELETE_SUBTASK_MEMBER_START,
  payload,
});

export const deleteSubTaskMemberSuccess = (response: any) => ({
  type: SubtaskActionTypes.DELETE_SUBTASK_MEMBER_SUCCESS,
  payload: response,
});

export const deleteSubTaskMemberFailure = (errorMessage: any) => ({
  type: SubtaskActionTypes.DELETE_SUBTASK_MEMBER_FAILURE,
  payload: errorMessage,
});

export const deleteSubTask = (subTask: ISubTask) => ({
  type: SubtaskActionTypes.DELETE_SUBTASK_START,
  payload: subTask,
});

export const deleteSubTaskSuccess = (response: any) => ({
  type: SubtaskActionTypes.DELETE_SUBTASK_SUCCESS,
  payload: response,
});

export const deleteSubTaskFailure = (errorMessage: any) => ({
  type: SubtaskActionTypes.DELETE_SUBTASK_FAILURE,
  payload: errorMessage,
});
