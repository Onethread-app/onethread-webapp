export const getCurrentUser = (state) => state.userReducer.user;
export const getCurrentUserId = (state) => state.userReducer.user._id;
export const getUserCompanyList = (state) =>
  state.userReducer.user.companies;
export const getTimeline = (state) => state.userReducer.user.timeline;
