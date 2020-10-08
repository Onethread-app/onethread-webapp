export const getCurrentBoard = (state) =>
  state.boardIndexReducer.boardReducer.currentBoard;
export const getCurrentTask = (state) =>
  state.boardIndexReducer.boardReducer.currentTask._id;