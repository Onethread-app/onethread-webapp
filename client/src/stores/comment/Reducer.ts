import { GET_ALL_COMMENT, CREATE_COMMENT } from './Types';
// import { isEqual } from 'lodash';
export interface Icomment {
  _id?: string;
  name?: string;
  profileImage?: string;
  position?: string;
  text?: string;
  createdAt?: Date;
}

// export interface IcommentList {
//   commentList : Icomment[];
// }

const InitialState = {
  commentList: [] as any,
};

export const CommentReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case GET_ALL_COMMENT:
      return {
        ...state,
        commentList: action.payload,
      };
    case CREATE_COMMENT:
      return {
        ...state,
        commentList: [
          {
            _id: action.payload._id,
            name: action.payload.name,
            profileImage: action.payload.profileImage,
            position: action.payload.position,
            text: action.payload.text,
            createdAt: action.payload.createdAt,
          },
          ...state.commentList,
        ],
      };
    // case COMPLETE_SUBTASK:
    //   return {
    //     ...state,
    //     subTaskList: state.subTaskList.map((subTask: ISubTask) => (
    //       isEqual(subTask._id, action.payload._id) ?
    //         {
    //           ...subTask,
    //           done: action.payload.done
    //         } : subTask
    //     ))
    //   };
    // case DELETE_SUBTASK:

    //   return {
    //     ...state,
    //     subTaskList: state.subTaskList.filter((subTask: ISubTask) => (
    //       subTask._id !== action.payload
    //     ))
    //   };
    // case UPDATE_SUBTASK_TITLE:
    //   return {
    //     ...state,
    //     subTaskList: state.subTaskList.map((subTask: ISubTask) => (
    //       isEqual(subTask._id, action.payload._id) ?
    //         {
    //           ...subTask,
    //           name: action.payload.name
    //         } : subTask
    //     ))
    //   };
    default:
      return state;
  }
};
