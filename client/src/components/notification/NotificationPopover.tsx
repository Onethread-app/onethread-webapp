import { useEffect, useState, useRef } from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import { isMobileOnly } from 'react-device-detect';
import { connect } from 'react-redux';

import { User } from 'stores/user/Reducer';
import {
  readNotification,
  getNotifications,
  incrementPageNumber,
  markAllAsRead,
} from 'stores/notifications/Action';

import { notificationType } from 'helpers/notification/rule';
import Notification from 'components/notification/NotificationItemForPopover';

interface INotificationPopover {
  notifications: any;
  user: User;
  readNotification: (notificationId: any) => void;
  getNotifications: () => void;
  incrementPageNumber: () => void;
  markAllAsRead: (list: string[]) => void;
}

const NotificationPopover = (props: INotificationPopover) => {
  const history = useHistory();
  const [lastNotificationElement, setLastNotificationElement] =
    useState<null | HTMLUnknownElement>(null);
  const [notificationToShow, setNotificationToShow] = useState<any>(
    [],
  );

  const observer = useRef(
    new IntersectionObserver(
      async (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          await props.incrementPageNumber();
          // props.getNotifications();
          // console.log(first);
        }
      },
      { threshold: 1 },
    ),
  );

  const onCLickNotification = async (sNotification: any) => {
    props.readNotification(sNotification.notification._id);
    const url = await notificationType[
      sNotification.notification.type
    ].path(sNotification.notification);
    props.getNotifications();
    history.push(url);
  };

  const handleAllRead = () => {
    props.markAllAsRead(
      notificationToShow.map((notification) => notification._id),
    );
  };

  useEffect(() => {
    setNotificationToShow(
      props.notifications.filter((noti) => {
        return noti.read === false;
      }),
    );
  }, [props.notifications]);

  useEffect(() => {
    const currentElement = lastNotificationElement;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }
    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [lastNotificationElement]);

  return (
    <>
      {notificationToShow.length > 0 && (
        <p
          className="pv2 mb0 ml-auto mr2 pointer dim"
          style={{ width: 'fit-content', color: '#106ba3' }}
          onClick={handleAllRead}
        >
          Mark all as read
        </p>
      )}
      <div
        style={{
          maxHeight: '300px',
          width: isMobileOnly ? '' : '500px',
        }}
        className="pv2 br4 overflow-y-auto"
      >
        {notificationToShow.length > 0 ? (
          notificationToShow.map(
            (sNotification: any, index) =>
              sNotification.notification && (
                <div
                  key={index}
                  onClick={() => {
                    onCLickNotification(sNotification);
                  }}
                >
                  {notificationToShow &&
                  notificationToShow.length === index + 1 ? (
                    <div ref={setLastNotificationElement}>
                      <Notification
                        type={sNotification.notification.type}
                        text={sNotification.notification.text}
                        read={sNotification.read}
                      />
                    </div>
                  ) : (
                    <Notification
                      type={sNotification.notification.type}
                      text={sNotification.notification.text}
                      read={sNotification.read}
                    />
                  )}
                </div>
              ),
          )
        ) : (
          <h3
            style={{
              maxHeight: '300px',
              textAlign: 'center',
            }}
            className="pa3 overflow-y-auto moon-gray"
          >
            No new notification
          </h3>
        )}
      </div>
      <div className="tc mv1">
        <NavLink to={`/${props.user.name}/notifications`}>
          See All
        </NavLink>
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  notifications: state.notificationReducer.allNotifications,
  user: state.userReducer.user,
});

export default connect(mapStateToProps, {
  readNotification,
  getNotifications,
  incrementPageNumber,
  markAllAsRead,
})(NotificationPopover);
