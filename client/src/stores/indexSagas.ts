import { all } from 'redux-saga/effects';
import getAllProject from './project/sagas/getProjectSaga';

export default function* rootSaga() {
  yield all([getAllProject()]);
}
