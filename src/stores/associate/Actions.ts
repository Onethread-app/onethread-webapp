import { tokenConfig } from 'stores/UtilsActions';
import { tigrowApi } from 'config';
import { isEqual } from 'lodash';
import { GET_ALL_ASSOCIATE, ADD_ASSOCIATE, SELECT_ASSOCIATE } from './Types';
import { ItemEntityProps } from 'components/fields/SuggestField';

export const addAssociate = (associateWith: ItemEntityProps, companyID: string) => async (
  dispatch: any
) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.post(`/associate`,
        {
          companyId: companyID,
          associateCompany: associateWith._id
        },
        headers
      );
      dispatch({ type: ADD_ASSOCIATE, payload: response.data });
      return response;
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

export const getAllAssociates = () => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      const companyId = getState().companyReducer.currentCompany._id;
      const response = await tigrowApi.get(`associate?companyId=${companyId}`, headers);
      const associates = response.data.map((associate: any) => (
        isEqual(companyId, associate.company._id) === true ? 
          {
            _id: associate._id,
            associateCompany: associate.associateCompany,
            createdAt: associate.createdAt
          } : {
            _id: associate._id,
            associateCompany: associate.company,
            createdAt: associate.createdAt
          }
      ));
      dispatch({ type: GET_ALL_ASSOCIATE, payload: associates });
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in selection of company fetching');
    }
  } catch (error) {
    // tslint:disable-next-line: no-console
    console.log(error.response);
  }
};

export const getSelectedAssociate = (associateId: string) => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization && associateId) {
      const companyId = getState().companyReducer.currentCompany._id;
      const response = await tigrowApi.get(`associate/${associateId}/${companyId}`, headers);
      dispatch({ type: SELECT_ASSOCIATE, payload: response.data });
      return response.data;
    } else {
      return 500;
    }
  } catch (error) {
    // tslint:disable-next-line: no-console
    console.log(error.response);
  }
};