export const getCompanyId = (state) =>
  state.companyReducer.currentCompany._id;
export const isCompanyLoading = (state) =>
  state.companyReducer.loading;
export const getParentCompany = (state) =>
  state.companyReducer.currentCompany.parentcom;
export const getCompanyName = (state) =>
  state.companyReducer.currentCompany.uniqueName;
