import { LANDING_APIS } from './Types';
import { tigrowApi } from 'config';

export const saveContactForm = (contactFormInfo: any) => async (
  dispatch: any,
) => {
  try {
    let response;
    response = await tigrowApi.post(
      `contact/contact-sale`,
      contactFormInfo,
    );
    dispatch({ type: LANDING_APIS.SAVE_CONTACT_FORM });
    return response.status;
  } catch (error) {
    return false;
  }
};
