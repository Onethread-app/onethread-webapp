export const getProjectId = (state) =>
  state.projectReducer.projectDetails._id;
export const getPendingProjects = (state) =>
  state.projectReducer.pendingProjects;
export const getCurrentProjectId = (state) =>
  state.projectReducer.pid;
