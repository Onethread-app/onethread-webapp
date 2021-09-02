import { SAVE_USER_BASIC_INFO_FORM } from './Types';

export const saveUserBasicInfoForm = (response: any) => ({
  type: SAVE_USER_BASIC_INFO_FORM,
  payload: response,
});
