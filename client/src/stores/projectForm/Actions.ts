import { SAVE_PROJECT_FORM } from './Types';

export const saveProjectForm = (response: any) => ({
  type: SAVE_PROJECT_FORM,
  payload: response,
});
