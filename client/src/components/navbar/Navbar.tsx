import React from 'react';
import { connect } from 'react-redux';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { isMobileOnly } from 'react-device-detect';

import Logo from 'resources/images/onethread-text.png';

import NotificationPopoverIcon from './NotificationPopoverIcon';
import ChatPopoverIcon from './ChatPopoverIcon';
import CompanyPopoverIcon from './CompanyPopoverIcon';
import UserPopoverIcon from './UserPopoverIcon';

import { getNotifications } from 'stores/notifications/Action';
import { fetchChats } from 'stores/room/Actions';
import { User } from 'stores/user/Reducer';

import { companySubscriber } from 'helpers/notification/subscribers';

interface INavbar {
  type: string;
  scrollTop?: number;
}

interface INavbarInternalProps extends INavbar {
  user: User;
  uniqueCompanyName: string;
  companyId: string;
  fetchChats: () => void;
  getNotifications: () => void;
}

const Navbar = (props: INavbarInternalProps) => {
  React.useEffect(() => {
    props.getNotifications();
    companySubscriber(props.companyId);
    props.fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const match = useRouteMatch();

  return (
    <div
      className={`top-0 z-2 pr5-ns bb flex justify-between items-center ${
        isMobileOnly ? 'shadow-4' : ''
      }`}
      style={{
        height: '60px',
        borderColor: props.type === 'home' ? '#0F0C4E' : 'white',
        position: isMobileOnly ? 'absolute' : 'sticky',
        borderRadius: isMobileOnly ? 0 : '0.5rem 0.5rem 0px 0px',
        backgroundColor: props.type === 'home' ? '#0F0C4E' : 'white',
        left: isMobileOnly ? 0 : 'auto',
        right: isMobileOnly ? 0 : 'auto',
      }}
    >
      <div>
        {props.type === 'home' ? (
          <div className="flex items-center ml4">
            <div style={{ width: '6rem' }}>
              <NavLink to={`/${props.user.name}/home`}>
                <img
                  src={Logo}
                  className="br2"
                  style={{ background: '#0F0C4E' }}
                  alt=""
                />
              </NavLink>
            </div>
          </div>
        ) : (
          <NavLink
            exact
            to={
              props.type === 'company'
                ? `/company/${props.uniqueCompanyName}/dashboard`
                : match.url.includes('/notifications')
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
                : match.url.includes('/notifications')
                ? 'Notifications'
                : ''}
            </div>
          </NavLink>
        )}
      </div>
      <div>
        <NotificationPopoverIcon type={props.type} />
        <ChatPopoverIcon type={props.type} />
        {!isMobileOnly && <CompanyPopoverIcon type={props.type} />}
        <UserPopoverIcon />
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.userReducer.user,
  companyId: state.companyReducer.currentCompany._id,
  uniqueCompanyName: state.companyReducer.currentCompany.uniqueName,
});

export default connect(mapStateToProps, {
  getNotifications,
  fetchChats,
})(Navbar);
