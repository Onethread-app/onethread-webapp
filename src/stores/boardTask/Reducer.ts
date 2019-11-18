import { BOARD_TASK_LOADING, SELECTED_TASK } from './Types'
import { IColumn } from 'stores/board/Reducer'

export interface ITask {
  _id?: string;
  name: string;
  description: string;
  // status: {
  //   _id: string;
  //   name: string;
  // }
  status?: {}
  assignedMembers?: Object[];
  dueDate?: Date;
  priority?: string;
  comments?: Object[];
  column?: IColumn;
}

const InitialState = {
  loading: false,
  selectedTask: {} as any,
  error: ""
}

export const BoardTaskReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case BOARD_TASK_LOADING:
      return {
        ...state,
        loading: true,
      }
    // case CREATE_TASK:
    //   return {
    //     ...state,
    //     selectedTask: action.payload.createdColumn,
    //     loading: false
    //   }
    // case CREATE_TASK_ERROR:
    //   return {
    //     ...state,
    //     error: action.payload,
    //     loading: false
    //   }
    case SELECTED_TASK: 
      return {
        ...state,
        selectedTask: action.payload,
        loading: false
      }
    default:
      return state;
  }
}