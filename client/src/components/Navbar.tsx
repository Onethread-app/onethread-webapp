import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Popover,
  Position,
  ButtonGroup,
  Dialog,
} from '@blueprintjs/core';
import { connect } from 'react-redux';
import { upperFirst } from 'lodash';
import { NavLink } from 'react-router-dom';
import { logoutAction } from 'stores/auth/Actions';
import { withRouter, RouteComponentProps } from 'react-router';
import { History } from 'history';
import ChatIcon from '@material-ui/icons/Chat';
import user from '../resources/images/profilePhoto.svg';
import { User } from 'stores/user/Reducer';
import { CompanyListView } from '../layouts/company/ListView';
import { CompanySignupForm } from '../layouts/company/Form';
import Notification from '../layouts/company/notification/index';
import { companySubscriber } from '../layouts/company/notification/subscribers';
import { notificationType } from '../layouts/company/notification/rule';
import {
  readNotification,
  seenNotification,
  clearSeen,
  incrementPageNumber,
} from '../stores/notifications/Action';
import { Badge } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { getNotifications } from '../stores/notifications/Action';
import { fetchRooms, fetchChats } from '../stores/room/Actions';
// import { RoomListItem } from '../layouts/company/room/leftSidebar/RoomListItem';
import { IRoom, IChat } from '../stores/room/Reducer';
import logo from 'resources/images/onethread-text.png';
import ChatListItem from 'components/chat/ChatListItem';

interface NavbarTopInternalProps {
  user: User;
  logoutAction: (history: History) => void;
  scrollTop: number;
  uniqueCompanyName: string;
  type: string;
  companyId: string;
  getNotifications: () => void;
  seenNotification: () => void;
  incrementPageNumber: () => void;
  clearSeen: () => void;
  fetchRooms: () => void;
  fetchChats: () => void;
  notifications: any;
  readNotification: any;
  read: number;
  seen: number;
  chats: [IChat];
  totalRoomUnread: number;
  currentRoom: IRoom;
}
// const roomBgColor = [
//   '#D8315B',
//   '#9F7DE8',
//   '#3F61C5',
//   '#456990',
//   '#CDA2AB',
//   '#FE5E41',
// ];
const NavbarTopComponent = (
  props: NavbarTopInternalProps & RouteComponentProps,
) => {
  const [showDialog, setShowDialog] = useState(false);
  // const [loading] = React.useState(true);
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
    props.match.path !== '/:username' && props.getNotifications();
    companySubscriber(props.companyId);
    props.fetchRooms();
    props.fetchChats();
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
    props.seen !== 0 && (await props.seenNotification());
    // props.getNotifications();
  };

  return (
    <>
      <div
        className="top-0 z-2 pr5 pv3 bg-white bb flex justify-between"
        style={{
          height: '60px',
          borderColor: props.type === 'home' ? '#0F0C4E' : 'white',
          position: 'sticky',
          borderRadius: '0.5rem 0.5rem 0px 0px',
          backgroundColor:
            props.type === 'home' ? '#0F0C4E' : 'white',
        }}
      >
        <div>
          {props.type !== 'home' ? (
            <NavLink
              exact
              to={`/company/${props.uniqueCompanyName}/dashboard`}
            >
              <div
                className="f4 fw6 tigrow-lightBlue ttc ws-break overflow-hidden nowrap mh4"
                style={{
                  textOverflow: 'ellipsis',
                }}
              >
                {props.type === 'company'
                  ? props.uniqueCompanyName
                  : ''}
              </div>
            </NavLink>
          ) : (
            <div className="flex items-center ml4">
              <div style={{ width: '6rem' }}>
                <NavLink to={`/${props.user.name}/home`}>
                  <img
                    src={logo}
                    className="br2"
                    style={{ background: '#0F0C4E' }}
                  />
                </NavLink>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center">
          {props.match.path !== '/:username' && (
            <Popover
              popoverClassName="bg-white"
              position={Position.BOTTOM}
              content={
                <div
                  style={{ maxHeight: '300px', width: '500px' }}
                  className="pv2 br4 overflow-y-auto"
                >
                  {props.notifications &&
                  props.notifications.length > 0 ? (
                    props.notifications.map(
                      (sNotification: any, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            onCLickNotification(sNotification);
                          }}
                        >
                          {props.notifications &&
                          props.notifications.length === index + 1 ? (
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
                      No Notification To Show
                    </h3>
                  )}
                </div>
              }
              target={
                <div className="mr2 pointer">
                  <Badge
                    badgeContent={props.seen}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    color="secondary"
                  >
                    <NotificationsIcon
                      style={{
                        color:
                          props.type === 'home'
                            ? 'white'
                            : 'dark-gray',
                      }}
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
                  style={{ maxHeight: '300px', width: '420px' }}
                  className="pt2 pb1 overflow-y-auto"
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
                <div className="mr3 pointer">
                  <Badge
                    badgeContent={props.totalRoomUnread}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    color="secondary"
                  >
                    <ChatIcon
                      style={{
                        color:
                          props.type === 'home'
                            ? 'white'
                            : 'dark-gray',
                      }}
                      onClick={handleSeenNotifications}
                    />
                  </Badge>
                </div>
              }
            />
          )}
          <Popover
            popoverClassName="bp3-popover-content-sizing bg-white"
            position={Position.BOTTOM}
            content={
              <CompanyListView
                showDialog={showDialog}
                setShowDialog={setShowDialog}
              />
            }
            target={
              <Button
                className="bp3-minimal dim f6 f5-l dib mr3 mr4-l outline-0"
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: '1px solid',
                  color:
                    props.type === 'home' ? 'white' : 'dark-gray',
                }}
                text="My Companies"
              />
            }
          />
          <Popover
            popoverClassName="bp3-popover-content-sizing"
            position={Position.BOTTOM}
            content={
              <ButtonGroup
                minimal={true}
                className="bp3-vertical bp3-fill"
              >
                <Button
                  className="bp3-minimal outline-0 bp3-popover-dismiss"
                  onClick={() =>
                    props.history.push(`/${props.user.name}`)
                  }
                >
                  <div className="dtc w1 w2-ns">
                    <img
                      src={
                        props.user.profileImage
                          ? props.user.profileImage
                          : user
                      }
                      className="db w1 w2-ns h1 h2-ns br-100 ba b--black-10 "
                    />
                  </div>
                  <div className="dtc v-mid pl3">
                    <h1 className="f7 f6-ns fw4 lh-title black mv0">
                      {`${upperFirst(
                        props.user.firstName,
                      )} ${upperFirst(props.user.lastName)}`}
                    </h1>
                  </div>
                </Button>
                <Button
                  className="bp3-minimal outline-0 bp3-popover-dismiss"
                  icon="cog"
                  alignText="left"
                  onClick={() =>
                    props.history.push(`/${props.user.name}/settings`)
                  }
                >
                  Settings
                </Button>
                <Button
                  className="bp3-minimal outline-0 bp3-popover-dismiss"
                  onClick={(e: any) =>
                    props.logoutAction(props.history)
                  }
                  icon="log-in"
                  alignText="left"
                >
                  Logout
                </Button>
              </ButtonGroup>
            }
            target={
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
              />
            }
          />
        </div>
      </div>
      {showDialog && (
        <Dialog
          onClose={() => setShowDialog(!showDialog)}
          isOpen={showDialog}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <div>
            <CompanySignupForm setShowDialog={setShowDialog} />
          </div>
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    uniqueCompanyName: state.companyReducer.currentCompany.uniqueName,
    companyId: state.companyReducer.currentCompany._id,
    notifications: state.notificationReducer.allNotifications,
    seen: state.notificationReducer.seen,
    read: state.notificationReducer.read,
    chats: state.roomReducer.chats,
    currentRoom: state.roomReducer.currentRoom,
    totalRoomUnread: state.roomReducer.totalUnread,
  };
};

export const NavbarTop = connect(mapStateToProps, {
  logoutAction,
  companySubscriber,
  readNotification,
  getNotifications,
  seenNotification,
  clearSeen,
  incrementPageNumber,
  fetchRooms,
  fetchChats,
})(withRouter(NavbarTopComponent));
