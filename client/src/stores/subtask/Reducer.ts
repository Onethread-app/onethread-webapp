import {
  GET_ALL_SUBTASK,
  CREATE_SUBTASK,
  COMPLETE_SUBTASK,
  DELETE_SUBTASK,
  UPDATE_SUBTASK_TITLE,
} from './Types';
import { isEqual } from 'lodash';
export interface ISubTask {
  _id?: string;
  name?: string;
  done?: boolean;
}
// export interface ISubTaskList {
//   subTaskList: ISubTask[];
// }

const InitialState = {
  subTaskList: [] as any,
};

export const SubTaskReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case GET_ALL_SUBTASK:
      return {
        ...state,
        subTaskList: action.payload,
      };
    case CREATE_SUBTASK:
      return {
        ...state,
        subTaskList: [
          {
            _id: action.payload._id,
            name: action.payload.name,
            done: action.payload.done,
          },
          ...state.subTaskList,
        ],
      };
    case COMPLETE_SUBTASK:
      return {
        ...state,
        subTaskList: state.subTaskList.map((subTask: ISubTask) =>
          isEqual(subTask._id, action.payload._id)
            ? {
                ...subTask,
                done: action.payload.done,
              }
            : subTask,
        ),
      };
    case DELETE_SUBTASK:
      return {
        ...state,
        subTaskList: state.subTaskList.filter(
          (subTask: ISubTask) => subTask._id !== action.payload,
        ),
      };
    case UPDATE_SUBTASK_TITLE:
      return {
        ...state,
        subTaskList: state.subTaskList.map((subTask: ISubTask) =>
          isEqual(subTask._id, action.payload._id)
            ? {
                ...subTask,
                name: action.payload.name,
              }
            : subTask,
        ),
      };
    default:
      return state;
  }
};
