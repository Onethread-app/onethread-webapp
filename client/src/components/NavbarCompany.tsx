import React, { useState, useEffect } from 'react';
import { Navbar, Drawer, Popover, Position } from '@blueprintjs/core';
import { MobileView } from 'react-device-detect';
import user from '../resources/images/profilePhoto.svg';
import { User } from 'stores/user/Reducer';
import { connect } from 'react-redux';
import { MobileListView } from '../layouts/company/MobileListView';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { companySubscriber } from 'helpers/notification/subscribers';
import {
  seenNotification,
  getNotifications,
} from '../stores/notifications/Action';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Badge } from '@material-ui/core';
import NotificationPopover from 'components/notification/NotificationPopover';
import { IChat, IRoom } from 'stores/room/Reducer';
import ChatIcon from '@material-ui/icons/Chat';
import { fetchRooms, fetchChats } from '../stores/room/Actions';
import ChatListItem from './chat/ChatListItem';

interface NavbarProps {
  title: string;
  user: User;
  notifications: any;
  read: number;
  companyId: string;
  getNotifications: any;
  seenNotification: () => void;
  fetchRooms: () => void;
  fetchChats: () => void;
  rooms: [IRoom];
  chats: [IChat];
  seen: number;
  totalRoomUnread: number;
  currentRoom: IRoom;
}

const NavbarCompanyComponent = (
  props: NavbarProps & RouteComponentProps,
) => {
  const [showDialog, setShowDialog] = useState(false);
  const query = new URLSearchParams(props.location.search);
  const view = query.get('view');

  useEffect(() => {
    if (props.match.path !== '/:username') {
      props.getNotifications();
    }
    companySubscriber(props.companyId);
    props.fetchRooms();
    props.fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                  content={<NotificationPopover />}
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
                      style={{
                        maxHeight: '300px',
                        width: '350px',
                        maxWidth: '100%',
                      }}
                      className="pa3 overflow-y-auto"
                    >
                      {props.chats && props.chats.length ? (
                        props.chats.map((chat: IChat, index) => (
                          <ChatListItem chat={chat} key={index} />
                        ))
                      ) : (
                        <p className="ph2">No room To Show</p>
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
    chats: state.roomReducer.chats,
    currentRoom: state.roomReducer.currentRoom,
    totalRoomUnread: state.roomReducer.totalUnread,
    seen: state.notificationReducer.seen,
  };
};
export const NavbarCompany = connect(mapStateToProps, {
  companySubscriber,
  getNotifications,
  seenNotification,
  fetchRooms,
  fetchChats,
})(withRouter(NavbarCompanyComponent));
