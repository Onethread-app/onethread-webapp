import { tokenConfig } from 'stores/UtilsActions';
import tigrowApi from 'tigrowApi';
import { GET_ALL_MEMBER, DELETE_MEMBER } from './Types';
import { ITaskMember } from './Reducer';
import { isEmpty } from 'lodash';

export const getAllMembers = () => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    const taskId = getState().boardIndexReducer.boardReducer.currentTask._id;
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.get(`tasks/member/${taskId}`, headers);

      const responseData = response.data.map((assigned: any) => {
        if (isEmpty(assigned.assignedPerson.profileImage)) {
          return {
            _id: assigned._id,
            name: assigned.assignedPerson.firstName + '' + assigned.assignedPerson.lastName,
            profileImage: ''
          };

        } else {
          return {
            _id: assigned._id,
            name: assigned.assignedPerson.firstName + '' + assigned.assignedPerson.lastName,
            profileImage: assigned.assignedPerson.profileImage.link
          };
        }

      });

      dispatch({ type: GET_ALL_MEMBER, payload: responseData });
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

export const deleteMember = (memberId: ITaskMember['_id']) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const taskId = getState().boardIndexReducer.boardReducer.currentTask._id;
      await tigrowApi.delete(`tasks/member/${taskId}?assignedMemberid=${memberId}`, headers);
      dispatch({ type: DELETE_MEMBER, payload: memberId });
    }
  } catch (error) {

    // tslint:disable-next-line: no-console
    console.log(error);
    // if (isEqual(error.message, 'Network Error')) {
    //   dispatch({ type: CREATE_BOARD_ERROR, payload: 'Network error' });
    // } else if (error.response.status === 401) {
    //   dispatch({ type: CREATE_BOARD_ERROR,
    //      payload: 'Unauthorized user. Please enter valid email and password.' });
    // } else {
    //   // tslint:disable-next-line: no-console
    //   console.log(error.response);
    // }
  }
};

//   export const assignMembers = (subTask: ISubTask) => async (dispatch: any, getState: any) => {
//     try {
//       const headers = tokenConfig();
//       const taskId = getState().boardIndexReducer.boardReducer.currentTask._id;
//       if ((headers as any).headers.Authorization) {
//         const reqBody = {
//           ...subTask,
//           taskId
//         };
//         // console.log( reqBody);
//         const response = await tigrowApi.post(`subTasks`, reqBody, headers);
//         // console.log(response);
//         dispatch({ type: CREATE_SUBTASK, payload: response.data });
//         // return response.data;
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