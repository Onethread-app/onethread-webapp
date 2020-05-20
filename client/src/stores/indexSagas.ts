import { all } from 'redux-saga/effects';
import getAllProject from './project/sagas/getProjectSaga';
import associateSaga from './associate/associateSaga';
import roomSaga from './room/roomSaga';
import companySaga from './company/companySaga';

export default function* rootSaga() {
  yield all([getAllProject(), associateSaga(), roomSaga(), companySaga()]);
  
}
