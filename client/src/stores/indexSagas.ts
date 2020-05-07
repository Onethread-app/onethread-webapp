import { all } from 'redux-saga/effects';
import getAllProject from './project/sagas/getProjectSaga';
import associateSaga from './associate/associateSaga';

export default function* rootSaga() {
  yield all([getAllProject(), associateSaga()]);
}
