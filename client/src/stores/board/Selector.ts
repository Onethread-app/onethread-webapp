import { createSelector } from 'reselect';

const selectBoard = (state) =>
  state.boardIndexReducer.boardReducer.currentBoard;
  
const selectColumns = createSelector(
  [selectBoard],
  (board) => board.columns,
);

export const getCurrentBoard = (state) =>
  state.boardIndexReducer.boardReducer.currentBoard;
export const getCurrentTask = (state) =>
  state.boardIndexReducer.boardReducer.currentTask._id;

export const selectColumnName = (colId) =>
  createSelector([selectColumns], (columns) =>
    columns.filter(column => column._id === colId)
  );
