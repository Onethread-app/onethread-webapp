import { all } from 'redux-saga/effects';
import projectSaga from './project/projectSaga';
import associateSaga from './associate/associateSaga';
import roomSaga from './room/roomSaga';
import notificationSaga from './notifications/notificationSaga';
import subscriptionSaga from './subscriptionBilling/subscriptionSaga';
import videoConferencesSaga from './videoConferences/saga';
import landingSaga from './landing/landingSaga';
import taskSaga from './task/taskSaga';
import commentSaga from './comment/commentSaga';
import companySaga from './company/companySaga';
import taskMembersSaga from './taskMembers/taskMembersSaga';
import subtaskSaga from './subtask/subtaskSaga';
import timeTrackerSaga from './time-tracker/timeTrackerSaga';
import userSaga from './user/UserSaga';
import authSaga from './auth/AuthSaga';

export default function* rootSaga() {
  yield all([
    projectSaga(),
    associateSaga(),
    roomSaga(),
    notificationSaga(),
    subscriptionSaga(),
    videoConferencesSaga(),
    landingSaga(),
    taskSaga(),
    commentSaga(),
    companySaga(),
    taskMembersSaga(),
    subtaskSaga(),
    timeTrackerSaga(),
    userSaga(),
    authSaga(),
  ]);
}
