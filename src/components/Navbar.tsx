import * as React from 'react'
import { Button, Popover, Position, Dialog } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { logoutAction } from 'actions/AuthActions';
import { withRouter, RouteComponentProps } from 'react-router';
import { History } from 'history';
import user from '../resources/images/user.png';
import logo from '../resources/images/tigrowLogo.png';
import { useState } from 'react';
import { ListItemViewWithImage as ListItemViewWithImage } from './common/ListItemViewWithImage';
import { CompanySignupForm } from './company/SignupForm';
// import { CopmpanyModel } from 'reducers/CompanyReducer';
interface NavbarTopProps {
  logoutAction: (history: History) => void;
}
interface CopmpanyModel {
  company: {
    companyName: string,
    companyType: string,
    companyMail: string,
    companyAddress: string
    legalOwnerName: string,
    legalOwnerMail: string,
  }
}
const NavbarTopComponent = (props: NavbarTopProps & RouteComponentProps & CopmpanyModel) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <nav className="bp3-navbar bp3-fixed-top">
        <div className="bp3-navbar-group bp3-align-left">
          <div className="bp3-navbar-heading">
            <Link to="/">
              <img
                src={logo}
                className="dib"
                alt="Site Name"
                style={{ width: '5rem' }}
              />
            </Link>
          </div>
        </div>
        <div className="bp3-navbar-group bp3-align-right">
          <Popover
            popoverClassName="bp3-popover-content-sizing"
            position={Position.BOTTOM}
          >
            <Button className="bp3-minimal  dim dark-gray f6 f5-l dib mr3 mr4-l">My Company</Button>
            <div className="mw6 center">

              <ListItemViewWithImage
                imageSrc="http://mrmrs.github.io/photos/p/2.jpg"
                listTitle={props.company.companyName}
                listDescription={props.company.companyAddress}
              />
              <button
                onClick={() => setShowDialog(!showDialog)}
                className="b--none w-100 br3 grow h2 ph5 pointer pv2 white outline-0 bg-tigrowLightBlue ma2"
              >
                Create Company
            </button>
            </div>
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
      {showDialog && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowDialog(!showDialog)}
          title="Company Sign Up"
          isOpen
          style={{ background: '#fff' }}
        >
          <div>
            <CompanySignupForm />
          </div>
        </Dialog>
      )}
    </>
  );
}

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.company
  }
}

export const NavbarTop = connect(mapStateToProps, { logoutAction })(withRouter(NavbarTopComponent));

