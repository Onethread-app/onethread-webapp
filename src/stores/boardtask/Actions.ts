// import { tokenConfig } from 'stores/UtilsActions';
// import tigrowApi from 'tigrowApi';
// import { isEqual } from 'lodash';
// import { ITask } from './Reducer';
// import { BOARD_TASK_LOADING } from './Types';
// import { CREATE_TASK, CREATE_TASK_ERROR } from 'stores/board/Types';

export const getTask = () => {
  
}

// export const getAllColumns = () => async (dispatch: any, getState: any) => {
//   try {
//     const headers = tokenConfig(getState);
//     const companyName = getState().companyReducer.currentCompany.name;
//     if ((headers as any).headers.Authorization) {
//       dispatch({ type: COLUMN_LOADING });
//       const response = await tigrowApi.get(`/company/${companyName}/board/boardId`, headers);
//       dispatch({ type: GET_ALL_COLUMNS, payload: response.data });
//       // return response.data;
//     }
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       dispatch({ type: CREATE_COLUMN_ERROR, payload: 'Network error' });
//     } else if (error.response.status === 401) {
//       dispatch({ type: CREATE_COLUMN_ERROR, payload: 'Unauthorized user. Please enter valid email and password.' });
//     } else {
//       console.log(error.response);
//     }
//   }
// }