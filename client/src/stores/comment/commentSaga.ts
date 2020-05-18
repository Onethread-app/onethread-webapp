import { all, put, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import { GET_ALL_COMMENT, comment } from './Types';
import { tigrowApi } from 'config';
import { tokenConfig } from 'stores/UtilsActions';
import { isEmpty } from 'lodash';
// import { errorMessgeHandler } from 'components/final-form/utils';

const takeLatest: any = Eff.takeLatest;

function* getAllComments() {
  try {
    const headers = tokenConfig();
    // const taskId = getState().boardIndexReducer.boardReducer
    //   .currentTask._id;
    const selectTaskId = (state) => state.boardIndexReducer.boardReducer.currentTask._id;
    const taskId = yield select(selectTaskId);
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

      yield put({ type: GET_ALL_COMMENT, payload: responseData });
    }
  } catch (error) {
    // tslint:disable-next-line: no-console
    console.log(error);
    // if (isEqual(error.message, 'Network Error')) {
    //   // dispatch({ type: CREATE_BOARD_ERROR, payload: 'Network error' });
    // } else if (error.response.status === 401) {
    //   dispatch({ type: CREATE_BOARD_ERROR,
    //      payload: 'Unauthorized user. Please enter valid email and password.' });
    // } else {
    //   // tslint:disable-next-line: no-console
    //   console.log(error.response);
    // }
  }
}

// function* createComment(action) {
//   try {
//     const headers = tokenConfig();
//     let response;
//     // const taskId = getState().boardIndexReducer.boardReducer
//     //   .currentTask._id;
//     const selectTaskId = (state) => state.boardIndexReducer.boardReducer.currentTask._id;
//     const taskId = yield select(selectTaskId);
//     // const currentUser = getState().userReducer.user;
//     const selectCurrentUser = (state) => state.userReducer.user;
//     const currentUser = yield select(selectCurrentUser);
//     if ((headers as any).headers.Authorization) {
//       const reqBody = {
//         text: action.text,
//         taskId,
//       };
//       response = yield tigrowApi.post(`comments`, reqBody, headers);
//       const responseData = {
//         _id: response.data._id,
//         name: currentUser.firstName + ' ' + currentUser.lastName,
//         profileImage:
//           currentUser.profileImage &&
//           isEmpty(currentUser.profileImage) === false
//             ? currentUser.profileImage
//             : '',
//         position: currentUser.position,
//         text: response.data.text,
//         createdAt: response.data.createdAt,
//       };
//       yield put({ type: CREATE_COMMENT, payload: responseData });
//       yield put({
//         type: comment.RESPONSE_STATUS_CODE,
//         payload: response.status
//       });
//     }
//     // return errorMessgeHandler(response);
//   } catch (error) {
//     // return errorMessgeHandler(error);
//   }
// }

export default function* commentSaga() {
  yield all([
    takeLatest(comment.GET_ALL_COMMENT_LOAD, getAllComments),
    // takeLatest(comment.CREATE_COMMENT_LOAD, createComment)
  ]);
}