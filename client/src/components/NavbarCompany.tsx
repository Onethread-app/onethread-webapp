import React, { useState, useEffect } from 'react';
import { Navbar, Drawer, Popover, Position } from '@blueprintjs/core';
import { MobileView } from 'react-device-detect';
import user from '../resources/images/profilePhoto.svg';
import { User } from 'stores/user/Reducer';
import { connect } from 'react-redux';
import { MobileListView } from '../layouts/company/MobileListView';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { companySubscriber } from 'layouts/company/notification/subscribers';
import { readNotification } from '../stores/notifications/Action';
import { getNotifications } from '../stores/notifications/Action';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Badge } from '@material-ui/core';
import { notificationType } from '../layouts/company/notification/rule';
import Notification from 'layouts/company/notification/index';

interface NavbarProps {
  title: string;
  user: User;
  notifications: any;
  read: number;
  companyId: string;
  readNotification: any;
  getNotifications: any;
}

const NavbarCompanyComponent = (props: NavbarProps & RouteComponentProps) => {

  const [showDialog, setShowDialog] = useState(false);
  const query = new URLSearchParams(props.location.search);
  const view = query.get('view');

  useEffect(() => {
    // tslint:disable-next-line: no-unused-expression
    props.match.path !== '/:username' && props.getNotifications();
    companySubscriber(props.companyId);
  }, []);

  const onCLickNotification = async (sNotification: any) => {
    await props.readNotification(sNotification.notification._id);
    const url = await notificationType[
      sNotification.notification.type
    ].path(sNotification.notification);
    props.getNotifications();
    props.history.push(url);
  };

  return (
    <>
      {!(view && view === 'mobile') && <MobileView>
        <Navbar fixedToTop className="flex justify-between items-center shadow-4" style={{ height: '55px' }}>
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
                    {props.notifications.length > 0 ? (
                      props.notifications.map((sNotification: any) => (
                        <div
                          onClick={() => {
                            onCLickNotification(sNotification);
                          }}
                        >
                          <Notification
                            type={sNotification.notification.type}
                            text={sNotification.notification.text}
                            read={sNotification.read}
                          />
                        </div>
                      ))
                    ) : (
                        <h2
                          style={{
                            maxHeight: '300px',
                            textAlign: 'center',
                          }}
                          className="pa3 overflow-y-auto moon-gray"
                        >
                          No Notification TO Show
                        </h2>
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
                      <NotificationsIcon />
                    </Badge>
                  </div>
                }
              />
            )}
            <img
              src={
                props.user.profileImage ? props.user.profileImage : user
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
      </MobileView>}
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
    read: state.notificationReducer.read
  };
};
export const NavbarCompany = connect(mapStateToProps,
  {
    companySubscriber,
    readNotification,
    getNotifications
  })(withRouter(NavbarCompanyComponent));
