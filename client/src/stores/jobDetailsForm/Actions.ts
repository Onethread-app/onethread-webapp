import { SAVE_JOB_DETAILS_FORM } from './Types';

export const saveJobDetailsForm = (response: any) => ({
  type: SAVE_JOB_DETAILS_FORM,
  payload: response,
});
