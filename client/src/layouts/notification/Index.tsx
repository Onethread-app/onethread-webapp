import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { isMobileOnly } from 'react-device-detect';

import moment from 'moment';
import { User } from 'stores/user/Reducer';
import {
  seenNotification,
  getNotifications,
} from 'stores/notifications/Action';

import NotificationSidebar from 'components/notification/NotificationSidebar';
import NotificationItem from 'components/notification/NotificationItem';

import './Index.scss';

interface INotificationPage {
  notifications: any;
  user: User;
  getNotifications: any;
  seenNotification: () => void;
}

const NotificationPage = (props: INotificationPage) => {
  const [activeTab, setActiveTab] = useState(0);
  const [notificationToShow, setNotificationToShow] = useState<any>(
    [],
  );
  const [miliSecondsInADay] = useState(86400000);
  const [miliSecondsInAWeek] = useState(604800016);
  const [miliSecondsInAMonth] = useState(2629800000);

  useEffect(() => {
    props.getNotifications();
  }, []);

  useEffect(() => {
    props.seenNotification();
  }, [notificationToShow]);

  useEffect(() => {
    const today = moment(new Date());

    switch (activeTab) {
      case 1:
        // past week
        setNotificationToShow(
          props.notifications.filter((notification) => {
            const nDate = moment(notification.createdAt);
            const diff = today.diff(nDate);
            return diff < miliSecondsInAWeek;
          }),
        );
        break;
      case 2:
        // past month
        setNotificationToShow(
          props.notifications.filter((notification) => {
            const nDate = moment(notification.createdAt);
            const diff = today.diff(nDate);
            return diff < miliSecondsInAMonth;
          }),
        );
        break;
      case 3:
        // all
        setNotificationToShow(props.notifications);
        break;

      default:
        // today
        setNotificationToShow(
          props.notifications.filter((notification) => {
            const nDate = moment(notification.createdAt);
            const diff = today.diff(nDate);
            return diff < miliSecondsInADay;
          }),
        );
        break;
    }
  }, [
    props.notifications,
    activeTab,
    miliSecondsInADay,
    miliSecondsInAWeek,
    miliSecondsInAMonth,
  ]);

  return (
    <div
      className={`notification-page flex ${
        isMobileOnly ? 'flex-column' : 'flex-row'
      } w-100`}
    >
      <NotificationSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className='notification-items flex flex-column flex-auto h-100'>
        {notificationToShow.length ? (
          notificationToShow.map(
            (notification: any) => notification.notification && (
            <NotificationItem
              notificationData={notification}
              key={notification._id}
            />
            ),
          )
        ) : (
          <h3
            style={{
              maxHeight: '300px',
              textAlign: 'center',
            }}
            className='pa3 overflow-y-auto moon-gray'
          >
            No notification to show
          </h3>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  notifications: state.notificationReducer.allNotifications,
  user: state.userReducer.user,
});

export default connect(mapStateToProps, {
  seenNotification,
  getNotifications,
})(NotificationPage);
