import { SAVE_EDU_DETAILS_FORM } from './Types';

export const saveEduDetailsForm = (response: any) => ({
  type: SAVE_EDU_DETAILS_FORM,
  payload: response,
});
