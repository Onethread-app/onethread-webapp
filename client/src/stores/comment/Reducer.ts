import { CommentActionTypes } from './Types';
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
  fetchingComment: false,
  isCreating: false,
  errorMessage: '',
};

export const CommentReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case CommentActionTypes.GET_ALL_COMMENTS_START:
      return {
        ...state,
        fetchingComment: true,
      };
    case CommentActionTypes.GET_ALL_COMMENTS_SUCCESS:
      return {
        ...state,
        commentList: action.payload,
        fetchingComment: false,
      };
    case CommentActionTypes.GET_ALL_COMMENTS_FAILURE:
      return {
        ...state,
        errorMessage: action.payload,
        fetchingComment: false,
      };
    case CommentActionTypes.CREATE_COMMENT_START:
      return {
        ...state,
        isCreating: true,
      };
    case CommentActionTypes.CREATE_COMMENT_SUCCESS:
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
        isCreating: false,
      };
    case CommentActionTypes.CREATE_COMMENT_FAILURE:
      return {
        ...state,
        errorMessage: action.payload,
        isCreating: false,
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
