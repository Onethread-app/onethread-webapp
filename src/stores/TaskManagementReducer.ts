import { combineReducers } from 'redux';
import { BoardReducer } from './board/Reducer';
// import { BoardColumnReducer } from './boardColumn/Reducer';
import { BoardTaskReducer } from './boardTask/Reducer';

export const TaskManagementReducer = combineReducers({
	boardReducer: BoardReducer,
	// boardColumnReducer: BoardColumnReducer,
	boardTaskReducer: BoardTaskReducer
});