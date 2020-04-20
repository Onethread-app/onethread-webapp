import {
  GET_ALL_MEMBER,
  DELETE_MEMBER,
  ASSIGN_MEMBER,
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
};

export const TaskMembersReducer = (
  state = InitialState,
  action: any,
) => {
  switch (action.type) {
    case ASSIGN_MEMBER:
      return {
        ...state,
        taskMemberList: [...action.payload, ...state.taskMemberList],
      };
    case GET_ALL_MEMBER:
      return {
        ...state,
        taskMemberList: action.payload,
      };
    case DELETE_MEMBER:
      return {
        ...state,
        taskMemberList: state.taskMemberList.filter(
          (taskMember: ITaskMember) =>
            taskMember._id !== action.payload,
        ),
      };
    default:
      return state;
  }
};
