import { all, put, call, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import { tokenConfig } from 'stores/UtilsActions';
import { tigrowApi } from 'config';

import { isEmpty } from 'lodash';

import { CommentActionTypes } from './Types';
import { getCurrentTaskId } from '../board/Selector';
import { getCurrentUser } from '../user/Selector';

import {
  createCommentFailure,
  createCommentSuccess,
  getAllCommentsFailure,
  getAllCommentsSuccess,
} from './Actions';
import { returnErrorText } from 'helpers/HandleSagaErrors';

const takeEvery: any = Eff.takeEvery;
const takeLatest: any = Eff.takeLatest;

export function* getAllComments() {
  try {
    const headers = tokenConfig();
    const taskId = yield select(getCurrentTaskId);

    if (taskId) {
      if ((headers as any).headers.Authorization) {
        const response = yield tigrowApi.get(
          `comments?taskId=${taskId}`,
          headers,
        );
        const responseData = response.data.map((comment: any) => {
          if (isEmpty(comment.account.profileImage)) {
            return {
              _id: comment._id,
              name:
                comment.account.firstName +
                ' ' +
                comment.account.lastName,
              profileImage: '',
              position: comment.account.position,
              text: comment.text,
              createdAt: comment.createdAt,
            };
          } else {
            return {
              _id: comment._id,
              name:
                comment.account.firstName +
                ' ' +
                comment.account.lastName,
              profileImage: comment.account.profileImage,
              position: comment.account.position,
              text: comment.text,
              createdAt: comment.createdAt,
            };
          }
        });
        yield put(getAllCommentsSuccess(responseData));
      }
    } else {
      yield put(getAllCommentsFailure('No Task ID'));
    }
  } catch (error) {
    yield put(getAllCommentsFailure(returnErrorText(error)));
  }
}

export function* createComment({ text }: any) {
  try {
    const headers = tokenConfig();
    const taskId = yield select(getCurrentTaskId);
    const currentUser = yield select(getCurrentUser);
    if ((headers as any).headers.Authorization) {
      const reqBody = {
        text,
        taskId,
      };
      const response = yield tigrowApi.post(
        `comments`,
        reqBody,
        headers,
      );
      const responseData = {
        _id: response.data._id,
        name: currentUser.firstName + ' ' + currentUser.lastName,
        profileImage:
          currentUser.profileImage &&
          isEmpty(currentUser.profileImage) === false
            ? currentUser.profileImage
            : '',
        position: currentUser.position,
        text: response.data.text,
        createdAt: response.data.createdAt,
      };
      yield put(createCommentSuccess(responseData));
    }
  } catch (error) {
    yield put(createCommentFailure(returnErrorText(error)));
  }
}

export function* onGetAllComments() {
  yield takeLatest(
    CommentActionTypes.GET_ALL_COMMENTS_START,
    getAllComments,
  );
}

export function* onCreateComment() {
  yield takeEvery(
    CommentActionTypes.CREATE_COMMENT_START,
    createComment,
  );
}

export default function* commentSaga() {
  yield all([call(onGetAllComments), call(onCreateComment)]);
}
