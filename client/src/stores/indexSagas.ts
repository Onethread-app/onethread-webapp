import { all } from 'redux-saga/effects';
import projectSaga from './project/projectSaga';
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
    projectSaga(),
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
