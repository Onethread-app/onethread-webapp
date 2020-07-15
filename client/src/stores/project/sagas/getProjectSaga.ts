import { takeEvery } from 'redux-saga/effects';
import { PROJECT } from '../Types';
// import { tokenConfig } from 'stores/UtilsActions';

// const fetchProjects = (url: any, headers: any, companyId: any) => {
//   fetch(`${url}/${companyId}`, headers);
// };
// const setProjects = (projects: any) => {
//   console.log(projects);
// };
// const setProjectError = () => {};

export function* handleProjecLoad() {
  // try {
  //   const state = select();
  //   const headers = tokenConfig();
  //   const companyId = yield (state as any).companyReducer
  //     .currentCompany._id;
  //   const projects = yield call(
  //     fetchProjects,
  //     'http://tigrow.co',
  //     headers,
  //     companyId,
  //   );
  //   yield put(setProjects(projects) as any);
  // } catch (e) {
  //   yield put(setProjectError() as any);
  // }
}

export default function* watchGetProject() {
  yield takeEvery(PROJECT.PROJECT_GET_ALL_PROJECTS, handleProjecLoad);
}
