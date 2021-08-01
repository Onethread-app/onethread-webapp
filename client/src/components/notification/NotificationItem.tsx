import React from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import { notificationType } from 'helpers/notification/rule';
import { readNotification } from 'stores/notifications/Action';

interface INotificationItem {
  notificationData: any;
  readNotification: (notificationId: any) => void;
}

const NotificationItem = (props: INotificationItem) => {
  const { notification } = props.notificationData;
  const history = useHistory();

  const handleClick = async () => {
    props.readNotification(props.notificationData._id);
    const url = await notificationType[notification.type].path(
      notification,
    );
    history.push(url);
  };

  return (
    <div className="flex items-center" onClick={handleClick}>
      <div className="flex items-center">
        <img
          src={
            notification.type
              ? notificationType[notification.type].img
              : 'https://via.placeholder.com/20'
          }
          alt=""
          style={{ width: '20px' }}
        />
        <p
          className={`mb0 ml2 ${
            props.notificationData.read ? 'gray' : ''
          }`}
        >
          {notification.text}
        </p>
      </div>
      <span className="ml2 blue notification-time">
        {moment(props.notificationData.createdAt).fromNow()}
      </span>
    </div>
  );
};

export default connect(null, { readNotification })(NotificationItem);
