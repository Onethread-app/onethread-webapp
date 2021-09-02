import { SAVE_COMPANY_BASIC_INFO_FORM } from './Types';

export const saveCompanyBasicInfoForm = (response: any) => ({
  type: SAVE_COMPANY_BASIC_INFO_FORM,
  payload: response,
});
