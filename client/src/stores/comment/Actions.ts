import { CommentActionTypes } from './Types';
import { Icomment } from './Reducer';

export const getAllComments = () => ({
  type: CommentActionTypes.GET_ALL_COMMENTS_START,
});

export const getAllCommentsSuccess = (response: any) => ({
  type: CommentActionTypes.GET_ALL_COMMENTS_SUCCESS,
  payload: response,
});

export const getAllCommentsFailure = (errorMessage: any) => ({
  type: CommentActionTypes.GET_ALL_COMMENTS_FAILURE,
  payload: errorMessage,
});

export const createComment = (text: Icomment['text']) => ({
  type: CommentActionTypes.CREATE_COMMENT_START,
  text,
});

export const createCommentSuccess = (response: any) => ({
  type: CommentActionTypes.CREATE_COMMENT_SUCCESS,
  payload: response,
});

export const createCommentFailure = (errorMessage: any) => ({
  type: CommentActionTypes.CREATE_COMMENT_FAILURE,
  payload: errorMessage,
});
