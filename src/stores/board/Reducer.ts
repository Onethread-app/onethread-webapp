import { CREATE_BOARD, CREATE_BOARD_ERROR, GET_ALL_BOARDS, SELECT_BOARD, 
  CREATE_COLUMN_ERROR, CREATE_COLUMN, CREATE_TASK, CREATE_TASK_ERROR, 
  DRAG_AND_DROP_TASK_LOADING, DRAG_AND_DROP_TASK, DRAG_AND_DROP_TASK_ERROR, 
  UPDATE_COLUMN, ADD_TEAM_MEMBER_IN_BOARD, SELECT_TASK, UPDATE_TASK } from './Types';
import { isEqual } from 'lodash';

export interface IColumn {
  _id?: string;
  name: string;
  positionInBoard: number;
  tasks?: ITask[];
}

export interface TaskBoard {
  _id?: string;
  name: string;
  department: string;
  color: string;
  columns?: IColumn[];
  members?: Object[];
}

export interface ITask {
  _id?: string;
  name: string;
  description?: string;
  currentColumnName: string;
  createdAt: Date;
  createdBy: string;
  status?: {};
  assignedMembers?: Object[];
  dueDate?: Date;
  priority?: number;
  comments?: Object[];
  column?: IColumn;
}

export interface IBoard {
  boardList: TaskBoard[];
  currentBoard: TaskBoard;
  currentTask: ITask;
  boardError: string;
  boardColumnError: string;
  boardTaskError: string;
  dragTaskLoading: boolean;
  dragTaskError: string;
}

const InitialState = {
  boardList: [] as any,
  currentBoard: {
    _id: '',
    name: '',
    description: '',
    columns: [],
    members: []
  },
  currentTask: {},
  boardError: '',
  boardColumnError: '',
  boardTaskError: '',
  dragTaskLoading: false,
  dragTaskError: ''
};

export const BoardReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case CREATE_BOARD:
      return {
        ...state,
        boardList: [
          {
            _id: action.payload._id,
            name: action.payload.name,
            color: action.payload.color,
            department: action.payload.department,
            members: action.payload.members
          },
          ...state.boardList
        ]
      };
    case CREATE_BOARD_ERROR:
      return {
        ...state,
        boardError: action.payload,
      };
    case GET_ALL_BOARDS:
      return {
        ...state,
        boardList: action.payload,
      };
    case SELECT_BOARD:
      return {
        ...state,
        currentBoard: action.payload,
      };
    case ADD_TEAM_MEMBER_IN_BOARD:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          members: action.payload
        }
      };
    case CREATE_COLUMN:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columns: [
            ...state.currentBoard.columns,
            action.payload
          ]
        },
      };
    case CREATE_COLUMN_ERROR:
      return {
        ...state,
        boardColumnError: action.payload,
      };
    case UPDATE_COLUMN:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columns: state.currentBoard.columns.map((column: IColumn, i) => (
            isEqual(column._id, action.payload._id) ?
              {
                ...column,
                name: action.payload.name
              } : column
          ))
        }
      };
    case CREATE_TASK:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columns: state.currentBoard.columns.map((column: IColumn, i) => (
            isEqual(column._id, action.payload.columnId) ?
              {
                ...column,
                tasks: [
                  ...column.tasks!,
                  action.payload
                ]
              } : column
          ))
        },
      };
    case CREATE_TASK_ERROR:
      return {
        ...state,
        boardTaskError: action.payload,
      };
    case DRAG_AND_DROP_TASK_LOADING:
      return {
        ...state,
        dragTaskLoading: true,
      };
    case DRAG_AND_DROP_TASK:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columns: action.payload
        },
        dragTaskLoading: false,
      };
    case DRAG_AND_DROP_TASK_ERROR:
      return {
        ...state,
        dragTaskError: action.payload,
        dragTaskLoading: false
      };
    case SELECT_TASK:
      return {
        ...state,
        currentTask: action.payload,
      };
    case UPDATE_TASK:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columns: (state.currentBoard.columns as any).map((column: IColumn) => (
            isEqual(column._id, action.payload.columnId._id) ?
              {
                ...column,
                tasks: column.tasks && column.tasks.length > 0 ? column.tasks!.map((task: ITask) => (
                  isEqual(task._id, action.payload._id) ? 
                  {
                    ...task,
                    name: action.payload.name,
                    dueDate: action.payload.dueDate
                  } : task
                )) : []
              } : column
          ))
        },
        currentTask: action.payload
      };
    default:
      return state;
  }
};