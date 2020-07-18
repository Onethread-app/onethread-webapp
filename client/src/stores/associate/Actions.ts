import { tokenConfig } from 'stores/UtilsActions';
import { tigrowApi } from 'config';
import { isEqual } from 'lodash';
import {
  GET_ALL_ASSOCIATE,
  ADD_ASSOCIATE,
  SELECT_ASSOCIATE,
  GET_ALL_PENDING_ASSOCIATE,
} from './Types';
import { ItemEntityProps } from 'components/fields/SuggestField';
import { Associate } from './Reducer';
import { Toaster } from '@blueprintjs/core';
import { ICompany } from 'stores/company/Reducer';

export const addAssociate = (
  associateWith: ItemEntityProps,
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
) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const companyId = getState().companyReducer.currentCompany._id;
      const response = await tigrowApi.get(
        `associate/${companyId}`,
        headers,
      );
      const associates = response.data.map((associate: any) =>
        isEqual(companyId, associate.company._id) === true
          ? {
            _id: associate._id,
            associateCompany: associate.associateCompany,
            createdAt: associate.createdAt,
          }
          : {
            _id: associate._id,
            associateCompany: associate.company,
            createdAt: associate.createdAt,
          },
      );
      dispatch({ type: GET_ALL_ASSOCIATE, payload: associates });
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
      // return error.response;
    }
  }
};

export const getAllPendingAssociates = () => async (
  dispatch: any,
  getState: any,
) => {
  try {
    const headers = tokenConfig();

    if ((headers as any).headers.Authorization) {
      const companyId = getState().companyReducer.currentCompany._id;
      const response = await tigrowApi.get(
        `associate/pending/${companyId}`,
        headers,
      );

      const associates = response.data.map((associate: any) =>
        isEqual(companyId, associate.company._id) === true
          ? {
            _id: associate._id,
            associateCompany: associate.associateCompany,
            createdAt: associate.createdAt,
          }
          : {
            _id: associate._id,
            associateCompany: associate.company,
            createdAt: associate.createdAt,
          },
      );
      dispatch({
        type: GET_ALL_PENDING_ASSOCIATE,
        payload: associates,
      });
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
      // return error.response;
    }
  }
};

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

export const acceptPendingAssociate = (associateID: string) => async (
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
        `associate/accept/${companyID}`,
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
        const actualAssociate = response.data.company._id
          ? {
            _id: response.data._id,
            associateCompany: response.data.company,
            createdAt: response.data.createdAt,
          }
          : {
            _id: response.data._id,
            associateCompany: response.data.associateCompany,
            createdAt: response.data.createdAt,
          };
        dispatch({ type: ADD_ASSOCIATE, payload: actualAssociate });
        Toaster.create().show({
          message: `Successfully accepted`,
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
