import * as React from 'react'
import { Button, Popover, Position } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { logoutAction } from 'actions/AuthActions';
import { withRouter, RouteComponentProps } from 'react-router';
import { History } from 'history';
import user from '../resources/images/user.png';
import logo from '../resources/images/tigrowLogo.png';
import { CompanyList } from './company/CompanyList';
interface NavbarTopProps {
  logoutAction: (history: History) => void;
}

const NavbarTopComponent = (props: NavbarTopProps & RouteComponentProps) => {
  return (
    <>
      <nav
        className="db w-100 border-box pa2 ph5-l bg-white fixed ba b--tigrowLightGray-1 z-max"
      >
        <div className="db dtc-l v-mid  w-100 w-25-l tc tl-l mb2 mb0-l" title="Home">
          <img src={logo} className="dib w-20" alt="Site Name" />
        </div>
        <div className="db dtc-l v-mid w-100 w-75-l tc tr-l">
          <Popover
            popoverClassName="bp3-popover-content-sizing"
            position={Position.BOTTOM}
          >
            <Button className="bp3-minimal  dim dark-gray f6 f5-l dib mr3 mr4-l">My Company</Button>
            <CompanyList />
          </Popover>
          <button className="bp3-button bp3-minimal dim dark-gray bp3-icon-chat f6 f5-l dib mr3 mr4-l" ></button>
          <button className="bp3-button bp3-minimal dim dark-gray bp3-icon-notifications f6 f5-l dib mr3 mr4-l" ></button>
          <Popover
            popoverClassName="bp3-popover-content-sizing"
            position={Position.BOTTOM}
          >
            <a className="dim mid-gray f6 f5-l  v-mid " href="#" title="User">
              <img src={user} className="dib w2 h2 br-100" alt="user" />
            </a>
            <Button
              className="bp3-minimal dim dark-gray f6 f5-l dib mr3 mr4-l"
              onClick={(e: any) => props.logoutAction(props.history)}
            >
              Logout
          </Button>
          </Popover>
        </div>
      </nav>
    </>
  );
}

export const NavbarTop = connect(null, { logoutAction })(withRouter(NavbarTopComponent));

