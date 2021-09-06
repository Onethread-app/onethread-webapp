import { SAVE_REPORT_FORM } from './Types';

export const saveReportForm = (response: any) => ({
  type: SAVE_REPORT_FORM,
  payload: response,
});
