import { createSelector } from 'reselect';

const selectBoard = (state) => state.taskIndexReducer.taskReducer.currentBoard;

const selectColumns = createSelector(
  [selectBoard],
  (board) => board.columns,
);

export const getCurrentBoard = (state) => state.taskIndexReducer.taskReducer.currentBoard;
export const getCurrentBoardId = (state) => state.taskIndexReducer.taskReducer.currentBoard._id;
export const getCurrentTaskId = (state) => state.taskIndexReducer.taskReducer.currentTask._id;

export const selectColumnName = (colId) => createSelector([selectColumns], (columns) => columns.filter((column) => column._id === colId));
