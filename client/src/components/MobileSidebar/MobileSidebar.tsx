import React from 'react';

import { ClickAwayListener } from '@material-ui/core';

import ProfilePic from 'resources/svg/ProfilePic.svg';
import Dashboard from 'resources/svg/Dashboard.svg';
import Settings from 'resources/svg/Settings.svg';
import Logout from 'resources/svg/Logout.svg';

import './MobileSidebar.styles.scss';
import CompanyItem from './CompanyItem';
import { CreateCompany } from 'components/button/Button';

interface IMobileSidebar {
  setShowSidebar: (val: boolean) => void;
}

const MobileSidebar = (props: IMobileSidebar) => {
  return (
    <ClickAwayListener
      onClickAway={() => props.setShowSidebar(false)}
    >
      <div className="mobile-sidebar">
        <div className="mobile-sidebar-profile mt4">
          <div className="flex items-center justify-center">
            <div className="mr2">
              <img
                src={ProfilePic}
                width="58px"
                height="58px"
                alt="user"
              />
            </div>
            <div>
              <h3>Saepul Rohman</h3>
              <p>UX Designer at Toglas</p>
            </div>
          </div>
          <div className="team">Team : 02</div>
          <div className="flex flex-column">
            <div className="flex mb3">
              <img src={Dashboard} alt="dashboard" className="mr3" />
              <h5>Dashboard</h5>
            </div>
            <div className="flex mb3">
              <img
                src={Settings}
                alt="profile settings"
                className="mr3"
              />
              <h5>Profile Settings</h5>
            </div>
            <div className="flex">
              <img src={Logout} alt="logout" className="mr3" />
              <h5>Logout</h5>
            </div>
          </div>
        </div>
        <div className="mobile-sidebar-companies w-100">
          <h3>My Companies</h3>
          <div className="mt3">
            <CompanyItem />
          </div>
        </div>
        <div className="w-100">
          <CreateCompany />
        </div>
      </div>
    </ClickAwayListener>
  );
};

export default MobileSidebar;
