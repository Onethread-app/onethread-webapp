import { tokenConfig } from 'stores/UtilsActions';
import { tigrowApi } from 'config';
import { isEqual } from 'lodash';
import {
  associate,
  // ADD_ASSOCIATE,
  SELECT_ASSOCIATE,
  GET_ALL_PENDING_ASSOCIATE,
<<<<<<< HEAD
<<<<<<< HEAD
=======
  GET_PROJECT_ASSOCIATES
>>>>>>> f4601c6e... add associates in the project (#19)
=======
  GET_PROJECT_ASSOCIATES,
>>>>>>> 4e99f05f... code style issue fixed
} from './Types';
import { ItemEntityProps } from 'components/fields/SuggestField';
import { Associate } from './Reducer';
import { Toaster } from '@blueprintjs/core';
import { ICompany } from 'stores/company/Reducer';

export const addAssociate = (
  associateWith: ItemEntityProps,
<<<<<<< HEAD
  company: ICompany,
) => async (dispatch: any) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.post(
        `/associate/${company._id}`,
        {
          company: company,
          associateCompany: {
            _id: associateWith.mongo_id,
            name: associateWith.name,
          },
        },
        headers,
      );
      // dispatch({ type: ADD_ASSOCIATE_IN_PENDING_LIST, payload: response.data });
      return response.status;
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in selection of company fetching');
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      return error.response;
    }
  }
};

export const getAllAssociates = () => async (
  dispatch: any,
  getState: any,
=======
  companyID: string,
>>>>>>> 0db3de3c... Feat/notification (#198)
) => {
  return {
    type: associate.SEND_REQUEST_LOAD,
    associateWith,
    companyID,
  };
};
export const closeTaster = () => ({
  type: associate.CLOSE_TOASTER,
});

export const getAllAssociates = () => {
  return {
    type: associate.GET_ASSOCIATE_LOADING,
  };
};

export const getProjectAssociates = () => {
  return {
    type: associate.GET_PROJECT_ASSOCIATES_LOADING,
  };
};

export const getAllPendingAssociates = () => ({
  type: associate.GET_ALL_PENDING_ASSOCIATE_LOAD,
});

export const getSelectedAssociate = (associateId: string) => async (
  dispatch: any,
  getState: any,
) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization && associateId) {
      const companyId = getState().companyReducer.currentCompany._id;
      const response = await tigrowApi.get(
        `associate/${associateId}/${companyId}`,
        headers,
      );
      dispatch({ type: SELECT_ASSOCIATE, payload: response.data });
      return response.data;
    } else {
      return 500;
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      // return error.response;
    }
  }
};

export const acceptPendingAssociate = (associateID: string) => ({
  type: associate.ACCEPT_ASSOCIATE_REQUEST_LOADING,
  associateID,
});

export const rejectPendingAssociate = (associateID: string) => async (
  dispatch: any,
  getState: any,
) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization && associateID) {
      const companyID = getState().companyReducer.currentCompany._id;
      const pendingAssociates = getState().associateReducer
        .pendingAssociates;
      const response = await tigrowApi.post(
        `associate/reject/${companyID}`,
        {
          associateId: associateID,
        },
        headers,
      );
      if (response.status === 200) {
        const currentPendingAssociates = pendingAssociates.filter(
          (associate: Associate) =>
            isEqual(associate._id, associateID) === false,
        );
        dispatch({
          type: GET_ALL_PENDING_ASSOCIATE,
          payload: currentPendingAssociates,
        });
        Toaster.create().show({
          message: `Successfully rejected`,
          timeout: 3000,
          intent: 'success',
        });
      } else {
        // tslint:disable-next-line: no-console
        console.log(`Error in accept pending associate`);
      }
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      // tslint:disable-next-line: no-console
      console.log('network error');
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
      // return error.response;
    }
  }
};
