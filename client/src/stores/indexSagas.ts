import { all } from 'redux-saga/effects';
import getAllProject from './project/sagas/getProjectSaga';
import associateSaga from './associate/associateSaga';
import roomSaga from './room/roomSaga';
import notificationSaga from './notifications/notificationSaga';
import subscriptionSaga from './subscriptionBilling/subscriptionSaga';
import videoConferencesSaga from './videoConferences/saga';
import landingSaga from './landing/landingSaga';
import boardSaga from './board/boardSaga';
import commentSaga from './comment/commentSaga';
import companySaga from './company/companySaga';

export default function* rootSaga() {
  yield all([
    getAllProject(),
    associateSaga(),
    roomSaga(),
    notificationSaga(),
    subscriptionSaga(),
    videoConferencesSaga(),
    landingSaga(),
    boardSaga(),
    commentSaga(),
    companySaga(),
  ]);
}
