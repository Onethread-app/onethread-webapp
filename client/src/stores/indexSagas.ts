import { all } from 'redux-saga/effects';
import getAllProject from './project/sagas/getProjectSaga';
import associateSaga from './associate/associateSaga';
import roomSaga from './room/roomSaga';
import notificationSaga from './notifications/notificationSaga';
import subscriptionSaga from './subscriptionBilling/subscriptionSaga';

export default function* rootSaga() {
  yield all([
    getAllProject(),
    associateSaga(),
    roomSaga(),
    notificationSaga(),
    subscriptionSaga(),
  ]);
}
