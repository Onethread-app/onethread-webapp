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
        errorMessage: '',
      };
    case CommentActionTypes.GET_ALL_COMMENTS_SUCCESS:
      return {
        ...state,
        commentList: action.payload,
        errorMessage: '',
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
          ...state.commentList,
          {
            _id: action.payload._id,
            name: action.payload.name,
            profileImage: action.payload.profileImage,
            position: action.payload.position,
            text: action.payload.text,
            createdAt: action.payload.createdAt,
          },
        ],
        isCreating: false,
      };
    case CommentActionTypes.CREATE_COMMENT_FAILURE:
      return {
        ...state,
        errorMessage: action.payload,
        isCreating: false,
      };
    default:
      return state;
  }
};
