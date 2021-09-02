import { SAVE_TASK_FORM } from './Types';

export const saveTaskForm = (response: any) => ({
  type: SAVE_TASK_FORM,
  payload: response,
});
