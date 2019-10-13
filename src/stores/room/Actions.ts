import tigrowApi from 'tigrowApi';
import { isEqual } from 'lodash';
import { History } from 'history';
import { tokenConfig } from '../UtilsActions';
import { CompanyModel } from 'stores/company/Reducer';
import { CREATE_ROOM_FROM_SERVER, CREATE_COMPANY_ERROR_FROM_SERVER } from './Types';

// TODO: fix create room
export const createRoomAction = (companyData: CompanyModel, routeHistory: History) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig(getState);
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.post(`/company`, companyData, headers);
      dispatch({ type: CREATE_ROOM_FROM_SERVER, payload: response.data });
      // routeHistory.push(`/company/${response.data.company.name}`);
    } else {
      console.log("error in creation of company")
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({ type: CREATE_COMPANY_ERROR_FROM_SERVER, payload: 'Network error' });
    } else if (error.response.status === 401) {
      dispatch({ type: CREATE_COMPANY_ERROR_FROM_SERVER, payload: 'Unauthorized user.' });
    } else {
      console.log(error.response);
    }
  }
}


// export const getCompanyDetails = (name: string) => async (dispatch: any, getState: any) => {
//   try {
//     const headers = tokenConfig(getState);
//     if ((headers as any).headers.Authorization) {
//       const response = await tigrowApi.get(`/company/${name}`, headers);
//       dispatch({ type: GET_COMPANY_DETAILS, payload: response.data });
//       return response.data;
//     } else {
//       console.log("error in slection of company fetching")
//     }
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       dispatch({ type: CREATE_COMPANY_ERROR, payload: 'Network error' });
//     } else if (error.response.status === 401) {
//       dispatch({ type: CREATE_COMPANY_ERROR, payload: 'Unauthorized user. Please enter valid email and password.' });
//     } else {
//       console.log(error.response);
//     }
//   }
// }