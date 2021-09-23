import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isMobileOnly } from 'react-device-detect';
import { connect } from 'react-redux';
import { History } from 'history';

import { Position } from '@blueprintjs/core/lib/esm/common/position';
import { Dialog } from '@blueprintjs/core/lib/esm/components/dialog/dialog';
import { Drawer } from '@blueprintjs/core/lib/esm/components/drawer/drawer';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';
import { ButtonGroup } from '@blueprintjs/core/lib/esm/components/button/buttonGroup';

import { User } from 'stores/user/Reducer';
import { logoutAction } from 'stores/auth/Actions';

import UserIcon from 'resources/images/profilePhoto.svg';

import { MobileListView } from 'layouts/company/MobileListView';
import ReportForm from 'components/ReportForm';

interface IUserPopoverIcon {
  user: User;
  logoutAction: (history: History) => void;
}

const UserPopoverIcon = (props: IUserPopoverIcon) => {
  const history = useHistory();
  const { t } = useTranslation();
  const [showDialog, setShowDialog] = useState(false);
  const [showButtonReport, setShowButtonReport] = useState(false);

  return (
    <>
      {isMobileOnly ? (
        <img
          src={
            props.user.profileImage
              ? props.user.profileImage
              : UserIcon
          }
          className={`dim v-mid dib pointer br2 ${
            isMobileOnly ? 'mr2' : ''
          }`}
          style={{
            width: '2rem',
            height: '2rem',
            objectFit: 'cover',
          }}
          alt='user'
          onClick={() => setShowDialog(true)}
        />
      ) : (
        <Popover
          popoverClassName='bp3-popover-content-sizing'
          position={Position.BOTTOM}
          content={(
            <ButtonGroup
              minimal
              className='bp3-vertical bp3-fill'
            >
              <Button
                className='bp3-minimal outline-0 bp3-popover-dismiss'
                onClick={() => history.push(`/${props.user.name}`)}
              >
                <div className='dtc w1 w2-ns'>
                  <img
                    src={
                      props.user.profileImage
                        ? props.user.profileImage
                        : UserIcon
                    }
                    alt=''
                    className='db w1 w2-ns h1 h2-ns ba b--black-10 br2'
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
                onClick={() => history.push(`/${props.user.name}/settings`)}
              >
                {t('app.company.Settings.Settings')}
              </Button>
              <Button
                className='bp3-minimal outline-0 bp3-popover-dismiss'
                onClick={(e: any) => setShowButtonReport(true)}
                icon='issue'
                alignText='left'
              >
                {t('app.user.User-settings.Report-Issue')}
              </Button>
              <Button
                className='bp3-minimal outline-0 bp3-popover-dismiss'
                onClick={(e: any) => props.logoutAction(history)}
                icon='log-in'
                alignText='left'
              >
                {t('app.user.User-settings.Logout')}
              </Button>
            </ButtonGroup>
          )}
          target={(
            <img
              src={
                props.user.profileImage
                  ? props.user.profileImage
                  : UserIcon
              }
              className='dim v-mid dib pointer br2'
              style={{
                width: '2rem',
                height: '2rem',
                objectFit: 'cover',
              }}
              alt='user'
            />
          )}
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
      {showButtonReport && (
        <Dialog
          onClose={() => setShowButtonReport(!showButtonReport)}
          isOpen={showButtonReport}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <div>
            <ReportForm setShowButtonReport={setShowButtonReport} />
          </div>
        </Dialog>
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
