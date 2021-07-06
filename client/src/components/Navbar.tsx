import React, { useState, useEffect } from 'react';
import {
  Button,
  Popover,
  Position,
  ButtonGroup,
  Dialog,
} from '@blueprintjs/core';
import { isMobileOnly } from 'react-device-detect';
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
import NotificationPopover from 'components/notification/NotificationPopover';
import { companySubscriber } from '../helpers/notification/subscribers';
import {
  seenNotification,
  clearSeen,
  getNotifications,
} from '../stores/notifications/Action';
import { Badge } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { fetchRooms, fetchChats } from '../stores/room/Actions';
import { IRoom, IChat } from '../stores/room/Reducer';
import logo from 'resources/images/onethread-text.png';
import ChatListItem from 'components/chat/ChatListItem';
import { useTranslation } from 'react-i18next';

interface NavbarTopInternalProps {
  user: User;
  logoutAction: (history: History) => void;
  scrollTop: number;
  uniqueCompanyName: string;
  type: string;
  companyId: string;
  getNotifications: () => void;
  seenNotification: () => void;
  fetchRooms: () => void;
  fetchChats: () => void;
  read: number;
  seen: number;
  chats: [IChat];
  totalRoomUnread: number;
  currentRoom: IRoom;
}

const NavbarTopComponent = (
  props: NavbarTopInternalProps & RouteComponentProps,
) => {
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    props.getNotifications();
    companySubscriber(props.companyId);
    props.fetchRooms();
    props.fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSeenNotifications = async () => {
    props.seen !== 0 && (await props.seenNotification());
    // props.getNotifications();
  };

  const compareChats = (a: any, b: any) => {
    if (a.message.createdAt < b.message.createdAt) return 1;
    else if (a.message.createdAt > b.message.createdAt) return -1;
    else return 0;
  };

  const { t } = useTranslation();

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
              to={
                props.type === 'company'
                  ? `/company/${props.uniqueCompanyName}/dashboard`
                  : props.match.url.includes('/notifications')
                  ? `/${props.user.name}/notifications`
                  : `/${props.user.name}`
              }
            >
              <div
                className="f4 fw6 tigrow-lightBlue ttc ws-break overflow-hidden nowrap mh4"
                style={{
                  textOverflow: 'ellipsis',
                }}
              >
                {props.type === 'company'
                  ? props.uniqueCompanyName
                  : props.match.url.includes('/notifications')
                  ? 'Notifications'
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
                    alt=""
                  />
                </NavLink>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center">
          <Popover
            popoverClassName="bg-white"
            position={Position.BOTTOM}
            content={<NotificationPopover />}
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
                        props.type === 'home' ? 'white' : 'dark-gray',
                    }}
                    onClick={handleSeenNotifications}
                  />
                </Badge>
              </div>
            }
          />
          <Popover
            popoverClassName="bg-white"
            position={Position.BOTTOM}
            content={
              <div
                style={{
                  maxHeight: '300px',
                  width: isMobileOnly ? '320px' : '420px',
                }}
                className={`pt2 pb1 overflow-y-auto`}
              >
                {props.chats && props.chats.length ? (
                  props.chats
                    .sort(compareChats)
                    .map((chat: IChat, index) => (
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
                        props.type === 'home' ? 'white' : 'dark-gray',
                    }}
                  />
                </Badge>
              </div>
            }
          />

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
                // text="My Companies"
                text={t('app.homepage.My-Companies')}
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
                      alt=""
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
                  {t('app.company.Settings.Settings')}
                  {/* Settings */}
                </Button>
                <Button
                  className="bp3-minimal outline-0 bp3-popover-dismiss"
                  onClick={(e: any) =>
                    props.logoutAction(props.history)
                  }
                  icon="log-in"
                  alignText="left"
                >
                  {t('app.user.User-settings.Logout')}
                  {/* Logout */}
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
  getNotifications,
  seenNotification,
  clearSeen,
  fetchRooms,
  fetchChats,
})(withRouter(NavbarTopComponent));
