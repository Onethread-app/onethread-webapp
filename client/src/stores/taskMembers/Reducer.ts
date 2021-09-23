import {
  GET_ALL_MEMBER_START,
  GET_ALL_MEMBER_SUCCESS,
  GET_ALL_MEMBER_FAILURE,
  DELETE_MEMBER_START,
  DELETE_MEMBER_SUCCESS,
  DELETE_MEMBER_FAILURE,
  ASSIGN_MEMBER_START,
  ASSIGN_MEMBER_SUCCESS,
  ASSIGN_MEMBER_FAILURE,
} from './Types';

export interface ITaskMember {
  _id?: string;
  name: string;
  account: string;
  profileImage?: string;
}

export interface ISubTaskList {
  subTaskList: ITaskMember[];
}

const InitialState = {
  taskMemberList: [] as any,
  isEditingTask: false,
};

export const TaskMembersReducer = (
  state = InitialState,
  action: any,
) => {
  switch (action.type) {
    case ASSIGN_MEMBER_START:
      return {
        ...state,
        isEditingTask: true,
      };
    case ASSIGN_MEMBER_SUCCESS:
      return {
        ...state,
        taskMemberList: [...action.payload, ...state.taskMemberList],
        isEditingTask: false,
      };
    case ASSIGN_MEMBER_FAILURE:
      return {
        ...state,
        error: [...action.payload, ...state.taskMemberList],
        isEditingTask: false,
      };

    case GET_ALL_MEMBER_START:
      return {
        ...state,
        isEditingTask: true,
        error: '',
      };

    case GET_ALL_MEMBER_SUCCESS:
      return {
        ...state,
        taskMemberList: action.payload,
        isEditingTask: false,
        error: '',
      };

    case GET_ALL_MEMBER_FAILURE:
      return {
        ...state,
        error: action.payload,
        isEditingTask: false,
      };

    case DELETE_MEMBER_START:
      return {
        ...state,
        isEditingTask: true,
      };

    case DELETE_MEMBER_SUCCESS:
      return {
        ...state,
        taskMemberList: state.taskMemberList.filter(
          (taskMember: ITaskMember) => taskMember._id !== action.payload,
        ),
        isEditingTask: false,
      };

    case DELETE_MEMBER_FAILURE:
      return {
        ...state,
        error: action.payload,
        isEditingTask: false,
      };
    default:
      return state;
  }
};
