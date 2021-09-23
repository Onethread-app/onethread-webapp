import { connect } from 'react-redux';

import Badge from '@material-ui/core/Badge/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { Position } from '@blueprintjs/core/lib/esm/common/position';
import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';

import { seenNotification } from 'stores/notifications/Action';

import NotificationPopover from 'components/notification/NotificationPopover';

interface INotificationIcon {
  type: string;
}

interface INotificationIconInternalProps extends INotificationIcon {
  seen: number;
  seenNotification: () => void;
}

const NotificationPopoverIcon = (
  props: INotificationIconInternalProps,
) => {
  const handleSeenNotifications = async () => {
    props.seen !== 0 && props.seenNotification();
  };
  return (
    <Popover
      popoverClassName='bg-white'
      position={Position.BOTTOM}
      content={<NotificationPopover />}
      target={(
        <div className='mr2 pointer'>
          <Badge
            badgeContent={props.seen}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            color='secondary'
          >
            <NotificationsIcon
              style={{
                color: props.type === 'home' ? 'white' : 'dark-gray',
              }}
              onClick={handleSeenNotifications}
            />
          </Badge>
        </div>
      )}
    />
  );
};

const mapStateToProps = (state: any) => ({
  seen: state.notificationReducer.seen,
});

export default connect(mapStateToProps, { seenNotification })(
  NotificationPopoverIcon,
);
