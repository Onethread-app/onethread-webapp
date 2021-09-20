import { tokenConfig } from 'stores/UtilsActions';
import { tigrowApi } from 'config';
import { isEmpty, isEqual } from 'lodash';
import {
  GET_ALL_ASSOCIATE,
  ADD_ASSOCIATE,
  GET_ALL_PENDING_ASSOCIATE,
  associate,
} from './Types';
import { ItemEntityProps } from 'components/fields/SuggestField';
import { Associate } from './Reducer';
import { Toaster } from '@blueprintjs/core';
import { ICompany } from 'stores/company/Reducer';

export const addAssociate =
  (associateWith: ItemEntityProps, company: ICompany) =>
  async (dispatch: any) => {
    try {
      const headers = tokenConfig();
      if ((headers as any).headers.Authorization) {
        const response = await tigrowApi.post(
          `/associate/${company._id}`,
          {
            company,
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
      }
    } catch (error: any) {
      if (isEqual(error.message, 'Network Error')) {
        // tslint:disable-next-line: no-console
      } else {
        // tslint:disable-next-line: no-console

        return error.response;
      }
    }
  };

export const getAllAssociates =
  () => async (dispatch: any, getState: any) => {
    try {
      const headers = tokenConfig();
      const companyId = await getState().companyReducer.currentCompany
        ._id;
      if (
        (headers as any).headers.Authorization &&
        !isEmpty(companyId)
      ) {
        const response = await tigrowApi.get(
          `associate/${companyId}`,
          headers,
        );
        const associates = response.data.map((assoc: any) =>
          isEqual(companyId, assoc.company._id) === true
            ? {
                _id: assoc._id,
                associateCompany: assoc.associateCompany,
                createdAt: assoc.createdAt,
              }
            : {
                _id: assoc._id,
                associateCompany: assoc.company,
                createdAt: assoc.createdAt,
              },
        );
        dispatch({ type: GET_ALL_ASSOCIATE, payload: associates });
      } else {
        // tslint:disable-next-line: no-console
      }
    } catch (error: any) {
      if (isEqual(error.message, 'Network Error')) {
        // tslint:disable-next-line: no-console
      } else {
        // tslint:disable-next-line: no-console
        // return error.response;
      }
    }
  };

export const getAllPendingAssociates =
  () => async (dispatch: any, getState: any) => {
    try {
      const headers = tokenConfig();
      const companyId = await getState().companyReducer.currentCompany
        ._id;
      if (
        (headers as any).headers.Authorization &&
        !isEmpty(companyId)
      ) {
        const response = await tigrowApi.get(
          `associate/pending/${companyId}`,
          headers,
        );

        const associates = response.data.map((assoc: any) =>
          isEqual(companyId, assoc.company._id) === true
            ? {
                _id: assoc._id,
                associateCompany: assoc.associateCompany,
                createdAt: assoc.createdAt,
              }
            : {
                _id: assoc._id,
                associateCompany: assoc.company,
                createdAt: assoc.createdAt,
              },
        );
        dispatch({
          type: GET_ALL_PENDING_ASSOCIATE,
          payload: associates,
        });
      } else {
        // tslint:disable-next-line: no-console
      }
    } catch (error: any) {
      if (isEqual(error.message, 'Network Error')) {
        // tslint:disable-next-line: no-console
      } else {
        // tslint:disable-next-line: no-console
        // return error.response;
      }
    }
  };

export const acceptPendingAssociate =
  (associateID: string) => async (dispatch: any, getState: any) => {
    try {
      const headers = tokenConfig();
      if ((headers as any).headers.Authorization && associateID) {
        const companyID =
          getState().companyReducer.currentCompany._id;
        const pendingAssociates =
          getState().associateReducer.pendingAssociates;
        const response = await tigrowApi.post(
          `associate/accept/${companyID}`,
          {
            associateId: associateID,
          },
          headers,
        );
        if (response.status === 200) {
          const currentPendingAssociates = pendingAssociates.filter(
            (assoc: Associate) =>
              isEqual(assoc._id, associateID) === false,
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
        }
      }
    } catch (error: any) {
      if (isEqual(error.message, 'Network Error')) {
        // tslint:disable-next-line: no-console
      } else {
        // tslint:disable-next-line: no-console
        // return error.response;
      }
    }
  };

export const rejectPendingAssociate =
  (associateID: string) => async (dispatch: any, getState: any) => {
    try {
      const headers = tokenConfig();
      if ((headers as any).headers.Authorization && associateID) {
        const companyID =
          getState().companyReducer.currentCompany._id;
        const pendingAssociates =
          getState().associateReducer.pendingAssociates;
        const response = await tigrowApi.post(
          `associate/reject/${companyID}`,
          {
            associateId: associateID,
          },
          headers,
        );
        if (response.status === 200) {
          const currentPendingAssociates = pendingAssociates.filter(
            (assoc: Associate) =>
              isEqual(assoc._id, associateID) === false,
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
        }
      }
    } catch (error: any) {
      if (isEqual(error.message, 'Network Error')) {
        // tslint:disable-next-line: no-console
      } else {
        // tslint:disable-next-line: no-console
        // return error.response;
      }
    }
  };

export const getSelectedAssociate = (associateID: string) => ({
  type: associate.SELECT_ASSOCIATE_START,
  payload: associateID,
});

export const selectAssociateSuccess = (response: any) => ({
  type: associate.SELECT_ASSOCIATE_SUCCESS,
  payload: response,
});

export const selectAssociateFailure = (errorMessage: any) => ({
  type: associate.SELECT_ASSOCIATE_FAILURE,
  payload: errorMessage,
});
