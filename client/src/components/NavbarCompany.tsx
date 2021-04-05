import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Drawer, Popover, Position } from '@blueprintjs/core';
import { MobileView } from 'react-device-detect';
import user from '../resources/images/profilePhoto.svg';
import { User } from 'stores/user/Reducer';
import { connect } from 'react-redux';
import { MobileListView } from '../layouts/company/MobileListView';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { companySubscriber } from 'layouts/company/notification/subscribers';
import {
  readNotification,
  seenNotification,
  getNotifications,
  incrementPageNumber,
} from '../stores/notifications/Action';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Badge } from '@material-ui/core';
import { notificationType } from '../layouts/company/notification/rule';
import Notification from 'layouts/company/notification/index';
import { IRoom } from 'stores/room/Reducer';
import { isEqual } from 'lodash';
import { RoomListItem } from 'layouts/company/room/leftSidebar/RoomListItem';
import ChatIcon from '@material-ui/icons/Chat';
import { fetchRooms } from '../stores/room/Actions';

interface NavbarProps {
  title: string;
  user: User;
  notifications: any;
  read: number;
  companyId: string;
  readNotification: any;
  getNotifications: any;
  seenNotification: () => void;
  fetchRooms: () => void;
  incrementPageNumber: () => void;
  rooms: [IRoom];
  seen: number;
  totalRoomUnread: number;
  currentRoom: IRoom;
}
const roomBgColor = [
  '#D8315B',
  '#9F7DE8',
  '#0FA3A3',
  '#456990',
  '#CDA2AB',
  '#FE5E41',
];

const NavbarCompanyComponent = (
  props: NavbarProps & RouteComponentProps,
) => {
  const [showDialog, setShowDialog] = useState(false);
  const query = new URLSearchParams(props.location.search);
  const view = query.get('view');

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
  const [
    lastNotificationElement,
    setLastNotificationElement,
  ] = useState<null | HTMLUnknownElement>(null);

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

  useEffect(() => {
    if (props.match.path !== '/:username') {
      props.getNotifications();
    }
    companySubscriber(props.companyId);
    props.fetchRooms();
  }, []);

  const onCLickNotification = async (sNotification: any) => {
    await props.readNotification(sNotification.notification._id);
    const url = await notificationType[
      sNotification.notification.type
    ].path(sNotification.notification);
    props.getNotifications();
    props.history.push(url);
  };
  const handleSeenNotifications = async () => {
    // tslint:disable-next-line: no-unused-expression
    props.seen !== 0 && (await props.seenNotification());
  };

  return (
    <>
      {!(view && view === 'mobile') && (
        <MobileView>
          <Navbar
            fixedToTop
            className="flex justify-between items-center shadow-4"
            style={{ height: '55px' }}
          >
            <h1 className="f4">{props.title}</h1>
            <div className="flex justify-end items-center">
              {props.match.path !== '/:username' && (
                <Popover
                  popoverClassName="bg-white mh3"
                  position={Position.BOTTOM}
                  content={
                    <div
                      style={{ maxHeight: '300px' }}
                      className="pa3 overflow-y-auto"
                    >
                      {props.notifications &&
                      props.notifications.length > 0 ? (
                        props.notifications.map(
                          (sNotification: any, index) => (
                            <div
                              onClick={() => {
                                onCLickNotification(sNotification);
                              }}
                            >
                              {props.notifications &&
                              props.notifications.length ===
                                index + 1 ? (
                                <div ref={setLastNotificationElement}>
                                  <Notification
                                    type={
                                      sNotification.notification.type
                                    }
                                    text={
                                      sNotification.notification.text
                                    }
                                    read={sNotification.read}
                                  />
                                </div>
                              ) : (
                                <Notification
                                  type={
                                    sNotification.notification.type
                                  }
                                  text={
                                    sNotification.notification.text
                                  }
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
                          No Notification To Show
                        </h3>
                      )}
                    </div>
                  }
                  target={
                    <div className="mh4 pointer">
                      <Badge
                        badgeContent={props.read}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        color="secondary"
                      >
                        <NotificationsIcon
                          onClick={handleSeenNotifications}
                        />
                      </Badge>
                    </div>
                  }
                />
              )}
              {props.match.path !== '/:username' && (
                <Popover
                  popoverClassName="bg-white"
                  position={Position.BOTTOM}
                  content={
                    <div
                      style={{ maxHeight: '300px' }}
                      className="pa3 overflow-y-auto"
                    >
                      {props.rooms && props.rooms.length ? (
                        props.rooms.map(
                          (room: IRoom, i: number, arr: any) => {
                            return (
                              <RoomListItem
                                key={room._id}
                                room={room}
                                lastChild={isEqual(
                                  room._id,
                                  arr[props.rooms!.length - 1].id,
                                )}
                                active={
                                  props.currentRoom !== undefined &&
                                  room._id === props.currentRoom._id
                                }
                                iconBgColor={
                                  roomBgColor[i % roomBgColor.length]
                                }
                              />
                            );
                          },
                        )
                      ) : (
                        <h2
                          style={{
                            maxHeight: '300px',
                            textAlign: 'center',
                          }}
                          className="pa3 overflow-y-auto moon-gray"
                        >
                          No Room To Show
                        </h2>
                      )}
                    </div>
                  }
                  target={
                    <div className="mh4 pointer">
                      <Badge
                        badgeContent={props.totalRoomUnread}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        color="secondary"
                      >
                        <ChatIcon onClick={handleSeenNotifications} />
                      </Badge>
                    </div>
                  }
                />
              )}
              <img
                src={
                  props.user.profileImage
                    ? props.user.profileImage
                    : user
                }
                className="dim v-mid dib br-100 pointer"
                style={{
                  width: '2rem',
                  height: '2rem',
                  objectFit: 'cover',
                }}
                alt="user"
                onClick={() => setShowDialog(true)}
              />
            </div>
          </Navbar>
        </MobileView>
      )}
      {showDialog && (
        <Drawer
          onClose={() => setShowDialog(!showDialog)}
          isOpen={showDialog}
          canOutsideClickClose={false}
          style={{ width: '70%' }}
        >
          <div>
            <MobileListView
              showDialog={showDialog}
              setShowDialog={setShowDialog}
            />
          </div>
        </Drawer>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    companyId: state.companyReducer.currentCompany._id,
    notifications: state.notificationReducer.allNotifications,
    read: state.notificationReducer.read,
    rooms: state.roomReducer.roomNotification.rooms,
    currentRoom: state.roomReducer.currentRoom,
    totalRoomUnread: state.roomReducer.totalUnread,
    seen: state.notificationReducer.seen,
  };
};
export const NavbarCompany = connect(mapStateToProps, {
  companySubscriber,
  readNotification,
  getNotifications,
  seenNotification,
  incrementPageNumber,
  fetchRooms,
})(withRouter(NavbarCompanyComponent));
