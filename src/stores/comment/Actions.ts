import { tokenConfig } from 'stores/UtilsActions';
import { GET_ALL_COMMENT, CREATE_COMMENT } from './Types';
import { isEmpty } from 'lodash';
import { Icomment } from './Reducer';
import { errorMessgeHandler } from 'components/final-form/utils';
import { tigrowApi } from 'config';

export const getAllComments = () => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    const taskId = getState().boardIndexReducer.boardReducer.currentTask._id;
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.get(`comments?taskId=${taskId}`, headers);

      const responseData = response.data.map((comment: any) => {
        if (isEmpty(comment.account.profileImage)) {
          return {
            _id: comment._id,
            name: comment.account.firstName + ' ' + comment.account.lastName,
            profileImage: '',
            position: comment.account.position,
            text: comment.text,
            createdAt: comment.createdAt
          };

        } else {
          return {
            _id: comment._id,
            name: comment.account.firstName + ' ' + comment.account.lastName,
            profileImage: comment.account.profileImage,
            position: comment.account.position,
            text: comment.text,
            createdAt: comment.createdAt
          };
        }

      });

      dispatch({ type: GET_ALL_COMMENT, payload: responseData });
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
};

export const createComment = (text: Icomment['text']) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    let response;
    const taskId = getState().boardIndexReducer.boardReducer.currentTask._id;
    const currentUser = getState().userReducer.user;
    if ((headers as any).headers.Authorization) {
      const reqBody = {
        text,
        taskId
      };
      response = await tigrowApi.post(`comments`, reqBody, headers);
      const responseData = {
        _id: response.data._id,
        name: currentUser.firstName + ' ' + currentUser.lastName,
        profileImage: currentUser.profileImage &&
          isEmpty(currentUser.profileImage.link) === false ? currentUser.profileImage.link : '',
        position: currentUser.position,
        text: response.data.text,
        createdAt: response.data.createdAt
      };
      dispatch({ type: CREATE_COMMENT, payload: responseData });
    }
    return errorMessgeHandler(response);
  } catch (error) {
    return errorMessgeHandler(error);
  }
};

//   export const updateSubTask = (subTask: ISubTask) => async (dispatch: any, getState: any) => {
//     try {
//       const headers = tokenConfig();
//       if ((headers as any).headers.Authorization) {
//         const reqBody = {
//           done : subTask.done
//         };
//         const response = await tigrowApi.put(`subTasks/${subTask._id}`, reqBody, headers);
//         dispatch({ type: COMPLETE_SUBTASK, payload: response.data });
//       }
//     } catch (error) {

//       console.log(error);
//       // if (isEqual(error.message, 'Network Error')) {
//       //   dispatch({ type: CREATE_BOARD_ERROR, payload: 'Network error' });
//       // } else if (error.response.status === 401) {
//       //   dispatch({ type: CREATE_BOARD_ERROR,
//       //      payload: 'Unauthorized user. Please enter valid email and password.' });
//       // } else {
//       //   // tslint:disable-next-line: no-console
//       //   console.log(error.response);
//       // }
//     }
//   };

//   export const updateSubTaskTitile = (subTask: ISubTask) => async (dispatch: any, getState: any) => {
//     try {
//       const headers = tokenConfig();
//       if ((headers as any).headers.Authorization) {
//         const reqBody = {
//           name : subTask.name
//         };
//         const response = await tigrowApi.put(`subTasks/${subTask._id}`, reqBody, headers);
//         dispatch({ type: UPDATE_SUBTASK_TITLE, payload: response.data });
//       }
//     } catch (error) {

//       console.log(error);
//       // if (isEqual(error.message, 'Network Error')) {
//       //   dispatch({ type: CREATE_BOARD_ERROR, payload: 'Network error' });
//       // } else if (error.response.status === 401) {
//       //   dispatch({ type: CREATE_BOARD_ERROR,
//       //      payload: 'Unauthorized user. Please enter valid email and password.' });
//       // } else {
//       //   // tslint:disable-next-line: no-console
//       //   console.log(error.response);
//       // }
//     }
//   };

//   export const deleteSubTask = (subTask: ISubTask) => async (dispatch: any, getState: any) => {
//     try {
//       const headers = tokenConfig();
//       if ((headers as any).headers.Authorization) {
//         const subTaskId = subTask._id ;
//         await tigrowApi.delete(`subTasks/${subTaskId}`, headers);
//         dispatch({ type: DELETE_SUBTASK , payload: subTaskId });
//       }
//     } catch (error) {

//       console.log(error);
//       // if (isEqual(error.message, 'Network Error')) {
//       //   dispatch({ type: CREATE_BOARD_ERROR, payload: 'Network error' });
//       // } else if (error.response.status === 401) {
//       //   dispatch({ type: CREATE_BOARD_ERROR,
//       //      payload: 'Unauthorized user. Please enter valid email and password.' });
//       // } else {
//       //   // tslint:disable-next-line: no-console
//       //   console.log(error.response);
//       // }
//     }
//   };