import { LANDING_APIS } from './Types';

export const saveContactForm = (contactFormInfo: any) => ({
  type: LANDING_APIS.SAVE_CONTACT_FORM,
  payload: contactFormInfo,
});

export const saveContactFormSuccess = (response: any) => ({
  type: LANDING_APIS.SAVE_CONTACT_FORM_SUCCESS,
  payload: response,
});

export const saveContactFormFailure = (response: any) => ({
  type: LANDING_APIS.SAVE_CONTACT_FORM_FAILURE,
  payload: response,
});

export const resetContactFormResponse = () => ({
  type: LANDING_APIS.RESET_CONTACT_FORM_RESPONSE,
});

// export const saveContactForm = (contactFormInfo: any) => ({
//   dispatch: any,
// ) => {
//   try {
//     let response;
//     response = await tigrowApi.post(
//       `contact/contact-sale`,
//       contactFormInfo,
//     );
//     dispatch({ type: LANDING_APIS.SAVE_CONTACT_FORM });
//     return response.status;
//   } catch (error) {
//     return false;
//   }
// };
