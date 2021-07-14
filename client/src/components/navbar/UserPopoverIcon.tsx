import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { History } from 'history';
import { isMobileOnly } from 'react-device-detect';

import {
  Button,
  ButtonGroup,
  Drawer,
  Popover,
  Position,
} from '@blueprintjs/core';

import UserIcon from 'resources/images/profilePhoto.svg';

import { logoutAction } from 'stores/auth/Actions';
import { User } from 'stores/user/Reducer';
import { MobileListView } from 'layouts/company/MobileListView';

interface IUserPopoverIcon {
  user: User;
  logoutAction: (history: History) => void;
}

const UserPopoverIcon = (props: IUserPopoverIcon) => {
  const [showDialog, setShowDialog] = React.useState(false);
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <>
      {isMobileOnly ? (
        <img
          src={
            props.user.profileImage
              ? props.user.profileImage
              : UserIcon
          }
          className={`dim v-mid dib br-100 pointer ${
            isMobileOnly ? 'mr2' : ''
          }`}
          style={{
            width: '2rem',
            height: '2rem',
            objectFit: 'cover',
          }}
          alt="user"
          onClick={() => setShowDialog(true)}
        />
      ) : (
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
                onClick={() => history.push(`/${props.user.name}`)}
              >
                <div className="dtc w1 w2-ns">
                  <img
                    src={
                      props.user.profileImage
                        ? props.user.profileImage
                        : UserIcon
                    }
                    alt=""
                    className="db w1 w2-ns h1 h2-ns br-100 ba b--black-10 "
                  />
                </div>
                <div className="dtc v-mid pl3">
                  <h1 className="f7 f6-ns fw4 lh-title black mv0">
                    {`${props.user.firstName} ${props.user.lastName}`}
                  </h1>
                </div>
              </Button>
              <Button
                className="bp3-minimal outline-0 bp3-popover-dismiss"
                icon="cog"
                alignText="left"
                onClick={() =>
                  history.push(`/${props.user.name}/settings`)
                }
              >
                {t('app.company.Settings.Settings')}
                {/* Settings */}
              </Button>
              <Button
                className="bp3-minimal outline-0 bp3-popover-dismiss"
                onClick={(e: any) => props.logoutAction(history)}
                icon="log-in"
                alignText="left"
              >
                {t('app.user.User-settings.Logout')}
              </Button>
            </ButtonGroup>
          }
          target={
            <img
              src={
                props.user.profileImage
                  ? props.user.profileImage
                  : UserIcon
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
      )}
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

const mapStateToProps = (state: any) => ({
  user: state.userReducer.user,
});

export default connect(mapStateToProps, {
  logoutAction,
})(UserPopoverIcon);
