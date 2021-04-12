import { SubtaskActionTypes } from './Types';
import { isEqual } from 'lodash';

export interface ISubtaskMember {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
}
export interface ISubTask {
  _id?: string;
  name?: string;
  done?: boolean;
  assignedMembers?: [ISubtaskMember];
}

const InitialState = {
  subTaskList: [] as any,
  creatingSubTask: false,
  fetchingSubTask: false,
  updatingSubTask: false,
  deletingSubTask: false,
  addingMember: false,
  deletingMember: false,
  errorOnCreate: '',
  errorOnFetch: '',
  errorOnUpdate: '',
  errorOnDelete: '',
  errorOnAddingMember: '',
  errorOnDeletingMember: '',
};

export const SubTaskReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case SubtaskActionTypes.CREATE_SUBTASK_START:
      return {
        ...state,
        creatingSubTask: true,
      };
    case SubtaskActionTypes.CREATE_SUBTASK_SUCCESS:
      return {
        ...state,
        subTaskList: [
          {
            _id: action.payload._id,
            name: action.payload.name,
            done: action.payload.done,
          },
          ...state.subTaskList,
        ],
        creatingSubTask: false,
      };
    case SubtaskActionTypes.CREATE_SUBTASK_FAILURE:
      return {
        ...state,
        errorOnCreate: action.payload,
        creatingSubTask: false,
      };
    case SubtaskActionTypes.GET_ALL_SUBTASK_START:
      return {
        ...state,
        fetchingSubTask: true,
      };
    case SubtaskActionTypes.GET_ALL_SUBTASK_SUCCESS:
      return {
        ...state,
        subTaskList: action.payload,
        fetchingSubTask: false,
      };
    case SubtaskActionTypes.GET_ALL_SUBTASK_FAILURE:
      return {
        ...state,
        errorOnFetch: action.payload,
        fetchingSubTask: false,
      };
    case SubtaskActionTypes.UPDATE_SUBTASK_START:
      return {
        ...state,
        updatingSubTask: true,
      };
    case SubtaskActionTypes.UPDATE_SUBTASK_SUCCESS:
      return {
        ...state,
        subTaskList: state.subTaskList.map((subTask: ISubTask) =>
          isEqual(subTask._id, action.payload._id)
            ? {
                ...subTask,
                name: action.payload.name,
                done: action.payload.done,
              }
            : subTask,
        ),
        updatingSubTask: false,
      };
    case SubtaskActionTypes.UPDATE_SUBTASK_FAILURE:
      return {
        ...state,
        errorOnUpdate: action.payload,
        updatingSubTask: false,
      };
    case SubtaskActionTypes.ADD_SUBTASK_MEMBER_START:
      return {
        ...state,
        addingMember: true,
        errorOnAddingMember: '',
      };
    case SubtaskActionTypes.ADD_SUBTASK_MEMBER_SUCCESS:
      return {
        ...state,
        subTaskList: state.subTaskList.map((subTask: ISubTask) =>
          isEqual(subTask._id, action.payload._id)
            ? {
                ...subTask,
                assignedMembers: action.payload.assignedMembers,
              }
            : subTask,
        ),
        addingMember: false,
      };
    case SubtaskActionTypes.ADD_SUBTASK_MEMBER_FAILURE:
      return {
        ...state,
        errorOnAddingMember: action.payload,
        addingMember: false,
      };

    case SubtaskActionTypes.DELETE_SUBTASK_MEMBER_START:
      return {
        ...state,
        deletingMember: true,
        errorOnDeletingMember: '',
      };
    case SubtaskActionTypes.DELETE_SUBTASK_MEMBER_SUCCESS:
      return {
        ...state,
        subTaskList: state.subTaskList.map((subTask: ISubTask) =>
          isEqual(subTask._id, action.payload._id)
            ? {
                ...subTask,
                assignedMembers: action.payload.assignedMembers,
              }
            : subTask,
        ),
        deletingMember: false,
      };
    case SubtaskActionTypes.DELETE_SUBTASK_MEMBER_FAILURE:
      return {
        ...state,
        deletingMember: false,
        errorOnDeletingMember: action.payload,
      };
    case SubtaskActionTypes.DELETE_SUBTASK_START:
      return {
        ...state,
        deletingSubTask: true,
      };
    case SubtaskActionTypes.DELETE_SUBTASK_SUCCESS:
      return {
        ...state,
        subTaskList: state.subTaskList.filter(
          (subTask: ISubTask) => subTask._id !== action.payload,
        ),
        deletingSubTask: false,
      };
    case SubtaskActionTypes.DELETE_SUBTASK_FAILURE:
      return {
        ...state,
        errorOnDelete: action.payload,
        deletingSubTask: false,
      };
    default:
      return state;
  }
};
