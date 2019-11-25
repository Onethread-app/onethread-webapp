import { CREATE_BOARD, CREATE_BOARD_ERROR, GET_ALL_BOARDS, BOARD_LOADING, SELECT_BOARD, COLUMN_LOADING, CREATE_COLUMN_ERROR, CREATE_COLUMN, CREATE_TASK_LOADING, CREATE_TASK, CREATE_TASK_ERROR, DRAG_AND_DROP_TASK_LOADING, DRAG_AND_DROP_TASK, DRAG_AND_DROP_TASK_ERROR, UPDATE_COLUMN, ADD_TEAM_MEMBER_IN_BOARD } from './Types';
import { ITask } from 'stores/boardTask/Reducer';
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
  description: string;
  columns?: IColumn[];
  members?: Object[];
}

export interface IBoard {
  loading: boolean;
  boardList: TaskBoard[];
  currentBoard: TaskBoard;
  boardError: string;
  boardColumnLoading: boolean;
  boardColumnError: string;
  boardTaskLoading: boolean;
  boardTaskError: string;
  dragTaskLoading: boolean;
  dragTaskError: string;
}

const InitialState = {
  loading: false,
  boardList: [] as any,
  currentBoard: {
    _id: '',
    name: '',
    description: '',
    columns: [],
    members: []
  },
  boardError: "",
  boardColumnLoading: false,
  boardColumnError: "",
  boardTaskLoading: false,
  boardTaskError: "",
  dragTaskLoading: false,
  dragTaskError: ""
}

export const BoardReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case BOARD_LOADING:
      return {
        ...state,
        loading: true,
      }
    case CREATE_BOARD:
      return {
        ...state,
        // currentBoard: action.payload,
        loading: false,
        boardList: [
          {
            _id: action.payload._id,
            name: action.payload.name,
            description: action.payload.description
          },
          ...state.boardList
        ]
      }
    case CREATE_BOARD_ERROR:
      return {
        ...state,
        boardError: action.payload,
        loading: false
      }
    case GET_ALL_BOARDS:
      return {
        ...state,
        boardList: action.payload,
        loading: false
      }
    case SELECT_BOARD:
      return {
        ...state,
        currentBoard: action.payload,
        loading: false
      }
    case ADD_TEAM_MEMBER_IN_BOARD:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          members: action.payload
        }
      }
    case COLUMN_LOADING:
      return {
        ...state,
        boardColumnLoading: true,
      }
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
        boardColumnLoading: false,
      }
    case CREATE_COLUMN_ERROR:
      return {
        ...state,
        boardColumnError: action.payload,
        boardColumnLoading: false
      }
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
      }
    case CREATE_TASK_LOADING:
      return {
        ...state,
        boardTaskLoading: true,
      }
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
        boardTaskLoading: false,
      }
    case CREATE_TASK_ERROR:
      return {
        ...state,
        boardTaskError: action.payload,
        boardTaskLoading: false
      }
    case DRAG_AND_DROP_TASK_LOADING:
      return {
        ...state,
        dragTaskLoading: true,
      }
    case DRAG_AND_DROP_TASK:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columns: action.payload
        },
        dragTaskLoading: false,
      }
    case DRAG_AND_DROP_TASK_ERROR:
      return {
        ...state,
        dragTaskError: action.payload,
        dragTaskLoading: false
      }
    default:
      return state;
  }
}