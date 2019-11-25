import * as React from 'react'
import { Button, Popover, Position, ButtonGroup, Dialog } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { logoutAction } from 'stores/auth/Actions';
import { withRouter, RouteComponentProps } from 'react-router';
import { History } from 'history';
import user from '../resources/images/user.png';
import logo from '../resources/images/tigrowLogo.png';
import { User } from 'stores/user/Reducer';
import { ListView } from './company/ListView';
import { CompanySignupForm } from './company/SignupForm';

interface NavbarTopInternalProps {
  user: User
  logoutAction: (history: History) => void
}

const NavbarTopComponent = (props: NavbarTopInternalProps & RouteComponentProps) => {
  const [showDialog, setShowDialog] = React.useState(false);
  return (
    <>
      <nav className="bp3-navbar bp3-fixed-top">
        <div className="bp3-navbar-group bp3-align-left">
          <div className="bp3-navbar-heading">
            <Link to={`/${props.user.name}`}>
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
            popoverClassName="bp3-popover-content-sizing overflow-y-auto bg-white "
            position={Position.BOTTOM}
            content={
              <ListView
                showDialog={showDialog}
                setShowDialog={setShowDialog}
              />
            }
            target={<Button className="bp3-minimal  dim dark-gray f6 f5-l dib mr3 mr4-l outline-0">My Companies</Button>}
          />
          <button className="bp3-button bp3-minimal dim dark-gray bp3-icon-chat f6 f5-l dib mr3 mr4-l" ></button>
          <button className="bp3-button bp3-minimal dim dark-gray bp3-icon-notifications f6 f5-l dib mr3 mr4-l" ></button>
          <Popover
            popoverClassName="bp3-popover-content-sizing"
            position={Position.BOTTOM}
            content={
              <ButtonGroup minimal={true} className="bp3-vertical bp3-fill">
                <Button className="bp3-popover-dismiss outline-0">
                  <article
                    className="pointer"
                  >
                    <div className="dtc w1 w2-ns">
                      <img
                        src={props.user.profileImage ? props.user.profileImage.imageSource : user}
                        className="db w1 w2-ns h1 h2-ns br-100 ba b--black-10"
                      />
                    </div>
                    <div className="dtc v-mid pl3">
                      <Link className="bp3-popover-dismiss" to={`/${props.user.name}`}>
                        <h1 className="f7 f6-ns fw4 lh-title black mv0">{`${props.user.firstName} ${props.user.lastName}`}</h1>
                      </Link>
                    </div>
                  </article>
                </Button>
                <Button
                  className="bp3-minimal outline-0 bp3-popover-dismiss"
                  icon="cog"
                  alignText="left"
                  onClick={() => props.history.push(`/${props.user.name}/settings`)}
                >
                  Settings
                </Button>
                <Button
                  className="bp3-minimal outline-0 bp3-popover-dismiss"
                  onClick={(e: any) => props.logoutAction(props.history)}
                  icon="log-in"
                  alignText="left"
                >
                  Logout
            </Button>
              </ButtonGroup>
            }
            target={
              <img
                src={props.user.profileImage ? props.user.profileImage.imageSource : user}
                className="dim v-mid dib w2 h2 br-100 ba b--black-10 pointer" alt="user"
              />
            }
          />
        </div>
      </nav>
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
}

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user
  }
}

export const NavbarTop = connect(mapStateToProps, { logoutAction })(withRouter(NavbarTopComponent));

