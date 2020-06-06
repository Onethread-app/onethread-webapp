import { all } from 'redux-saga/effects';
import getAllProject from './project/sagas/getProjectSaga';
import associateSaga from './associate/associateSaga';
import roomSaga from './room/roomSaga';
import notificationSaga from './notifications/notificationSaga';
<<<<<<< HEAD
import subscriptionSaga from './subscriptionBilling/subscriptionSaga';
import videoConferencesSaga from './videoConferences/saga';
=======
>>>>>>> 0db3de3c... Feat/notification (#198)

export default function* rootSaga() {
  yield all([
    getAllProject(),
    associateSaga(),
    roomSaga(),
    notificationSaga(),
<<<<<<< HEAD
    subscriptionSaga(),
    videoConferencesSaga(),
=======
>>>>>>> 0db3de3c... Feat/notification (#198)
  ]);
}
