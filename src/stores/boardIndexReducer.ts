import { combineReducers } from 'redux';
import { SubTaskReducer } from './subtask/Reducer';
import { BoardReducer } from './board/Reducer';

export const BoardIndexReducer = combineReducers({
    boardReducer: BoardReducer,
    subTaskReducer: SubTaskReducer
});
