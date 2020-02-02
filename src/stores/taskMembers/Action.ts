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
            name: assigned.assignedPerson.firstName + ' ' + assigned.assignedPerson.lastName,
            account : assigned.account.firstName + ' ' + assigned.account.lastName,
            profileImage: ''
          };

        } else {
          return {
            _id: assigned._id,
            name: assigned.assignedPerson.firstName + ' ' + assigned.assignedPerson.lastName,
            account : assigned.account.firstName + ' ' + assigned.account.lastName,
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
