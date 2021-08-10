import React from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { isMobileOnly } from 'react-device-detect';

import Notification from 'components/notification/NotificationItemForPopover';

import { notificationType } from 'helpers/notification/rule';

import {
  readNotification,
  getNotifications,
  incrementPageNumber,
} from 'stores/notifications/Action';
import { User } from 'stores/user/Reducer';

interface INotificationPopover {
  notifications: any;
  user: User;
  readNotification: (notificationId: any) => void;
  getNotifications: () => void;
  incrementPageNumber: () => void;
}

const NotificationPopover = (props: INotificationPopover) => {
  const [
    lastNotificationElement,
    setLastNotificationElement,
  ] = React.useState<null | HTMLUnknownElement>(null);
  const [notificationToShow, setNotificationToShow] = React.useState<
    any
  >([]);
  const history = useHistory();

  React.useEffect(() => {
    setNotificationToShow(
      props.notifications.filter((noti) => {
        return noti.read === false;
      }),
    );
  }, [props.notifications]);

  const observer = React.useRef(
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

  React.useEffect(() => {
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

  const onCLickNotification = async (sNotification: any) => {
    props.readNotification(sNotification.notification._id);
    const url = await notificationType[
      sNotification.notification.type
    ].path(sNotification.notification);
    props.getNotifications();
    history.push(url);
  };

  return (
    <>
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
})(NotificationPopover);
