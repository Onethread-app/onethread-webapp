import * as React from 'react';
import { Button, Popover, Position, ButtonGroup, Dialog } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutAction } from 'stores/auth/Actions';
import { withRouter, RouteComponentProps } from 'react-router';
import { History } from 'history';
import user from '../resources/images/user.png';
import { User } from 'stores/user/Reducer';
import { CompanyListView } from '../layouts/company/ListView';
import { CompanySignupForm } from '../layouts/company/Form';

interface NavbarTopInternalProps {
  user: User;
  logoutAction: (history: History) => void;
  scrollTop: number;
}

const NavbarTopComponent = (props: NavbarTopInternalProps & RouteComponentProps) => {
  const [showDialog, setShowDialog] = React.useState(false);

  return (
    <>
      <div className="top-0 z-2 pr5 pv3"
        style={{
          height: '60px',
          backgroundColor: props.scrollTop > 60 ? '#C3D0DE' : 'white',
          position: 'sticky', 
          borderRadius: '0.5rem 0.5rem 0px 0px',
          borderBottom: '1px solid #d3d3d370'
        }}
      >
        <div className="fr">
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
                className="bp3-minimal dim dark-gray f6 f5-l dib mr3 mr4-l outline-0"
                style={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 600,
                  border: '1px solid'
                }}
                text="My Companies"
              />
            }
          />
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
                className="dim v-mid dib br-100 pointer"
                style={{ 
                  width: '2rem', 
                  height: '2rem', 
                  objectFit: 'cover'
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
    user: state.userReducer.user
  };
};

export const NavbarTop = connect(mapStateToProps, { logoutAction })(withRouter(NavbarTopComponent));
