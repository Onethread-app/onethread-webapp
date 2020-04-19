import { combineReducers } from 'redux';
import { SubTaskReducer } from './subtask/Reducer';
import { BoardReducer } from './board/Reducer';
import { TaskMembersReducer } from './taskMembers/Reducer';
import { CommentReducer } from './comment/Reducer';

export const BoardIndexReducer = combineReducers({
  boardReducer: BoardReducer,
  subTaskReducer: SubTaskReducer,
  taskMembersReducer: TaskMembersReducer,
  commentReducer: CommentReducer,
});
