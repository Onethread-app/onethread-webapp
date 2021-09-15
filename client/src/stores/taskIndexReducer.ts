import { combineReducers } from 'redux';
import { SubTaskReducer } from './subtask/Reducer';
import { TaskReducer } from './task/Reducer';
import { TaskMembersReducer } from './taskMembers/Reducer';
import { CommentReducer } from './comment/Reducer';

export const TaskIndexReducer = combineReducers({
  taskReducer: TaskReducer,
  subTaskReducer: SubTaskReducer,
  taskMembersReducer: TaskMembersReducer,
  commentReducer: CommentReducer,
});
