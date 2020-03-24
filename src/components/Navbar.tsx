import * as React from 'react';
import {
  Button,
  Popover,
  Position,
  ButtonGroup,
  Dialog
} from '@blueprintjs/core';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { logoutAction } from 'stores/auth/Actions';
import { withRouter, RouteComponentProps } from 'react-router';
import { History } from 'history';
import user from '../resources/images/profilePhoto.svg';
import { User } from 'stores/user/Reducer';
import { CompanyListView } from '../layouts/company/ListView';
import { CompanySignupForm } from '../layouts/company/Form';
import { Icon } from '@blueprintjs/core';
// import projects from '../resources/images/ProjectsIcon.svg';
import { tokenConfig } from 'stores/UtilsActions';
import { tigrowApi } from 'config';
import Notification from '../layouts/company/notification';
// import { AxiosResponse } from 'axios';

interface NavbarTopInternalProps {
  user: User;
  logoutAction: (history: History) => void;
  scrollTop: number;
  companyName: string;
  type: string;
  // data: AxiosResponse< []| undefined> ;
  // notification: any;
}

const NavbarTopComponent = (
  props: NavbarTopInternalProps & RouteComponentProps
) => {
  const [showDialog, setShowDialog] = React.useState(false);
  const [notifications, setNotifications] = React.useState([] as any);
  const getNotificatrion = async () => {
    const headers = tokenConfig();
    let data = [] as any;
    data = await tigrowApi.get(`notifications`, headers);
    // const noData = [1, 2 ] as any;
    setNotifications(data.data);
  };
  React.useEffect(() => {
    getNotificatrion();
  }, []);

  return (
    <>
      <div
        className='top-0 z-2 pr5 pv3 bg-white bb flex justify-between'
        style={{
          height: '60px',
          borderColor: props.scrollTop > 60 ? '#0fa3a3' : 'white',
          position: 'sticky',
          borderRadius: '0.5rem 0.5rem 0px 0px'
        }}
      >
        <div>
          <NavLink exact to={`/company/${props.companyName}`}>
            <div
              className='f4 fw6 tigrow-lightBlue ttc ws-break overflow-hidden nowrap mh4'
              style={{
                textOverflow: 'ellipsis'
              }}
            >
              {props.type === 'company' ? props.companyName : ''}
            </div>
          </NavLink>
        </div>
        {console.log(notifications)}
        <div className='flex items-center'>
          <Popover
            popoverClassName='bp3-popover-content-sizing bg-white'
            position={Position.BOTTOM}
            content={
              notifications.length > 0 &&
              notifications.map((sNotification: any) => (
                <Notification
                  type='associates'
                  text={sNotification.notification.text}
                />
              ))
            }
            target={
              <Icon icon='notifications' iconSize={25} className='mr3 mr4-l' />
            }
          />
          <Popover
            popoverClassName='bp3-popover-content-sizing bg-white'
            position={Position.BOTTOM}
            content={
              <CompanyListView
                showDialog={showDialog}
                setShowDialog={setShowDialog}
              />
            }
            target={
              <Button
                className='bp3-minimal dim dark-gray f6 f5-l dib mr3 mr4-l outline-0'
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: '1px solid'
                }}
                text='My Companies'
              />
            }
          />
          <Popover
            popoverClassName='bp3-popover-content-sizing'
            position={Position.BOTTOM}
            content={
              <ButtonGroup minimal={true} className='bp3-vertical bp3-fill'>
                <Button
                  className='bp3-minimal outline-0 bp3-popover-dismiss'
                  onClick={() => props.history.push(`/${props.user.name}`)}
                >
                  <div className='dtc w1 w2-ns'>
                    <img
                      src={props.user.profileImage ? props.user.profileImage : user}
                      className="db w1 w2-ns h1 h2-ns br-100 ba b--black-10 "
                    />
                  </div>
                  <div className='dtc v-mid pl3'>
                    <h1 className='f7 f6-ns fw4 lh-title black mv0'>
                      {`${props.user.firstName} ${props.user.lastName}`}
                    </h1>
                  </div>
                </Button>
                <Button
                  className='bp3-minimal outline-0 bp3-popover-dismiss'
                  icon='cog'
                  alignText='left'
                  onClick={() =>
                    props.history.push(`/${props.user.name}/settings`)
                  }
                >
                  Settings
                </Button>
                <Button
                  className='bp3-minimal outline-0 bp3-popover-dismiss'
                  onClick={(e: any) => props.logoutAction(props.history)}
                  icon='log-in'
                  alignText='left'
                >
                  Logout
                </Button>
              </ButtonGroup>
            }
            target={
              <img
                src={props.user.profileImage ? props.user.profileImage : user}
                className="dim v-mid dib br-100 pointer"
                style={{
                  width: '2rem',
                  height: '2rem',
                  objectFit: 'cover'
                }}
                alt='user'
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
    companyName: state.companyReducer.currentCompany.name
  };
};

export const NavbarTop = connect(mapStateToProps, { logoutAction })(
  withRouter(NavbarTopComponent)
);
