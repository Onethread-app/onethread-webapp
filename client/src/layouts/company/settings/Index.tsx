import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { isMobileOnly, MobileOnlyView } from 'react-device-detect';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import Modal from 'react-modal';
import { Tabs } from '@blueprintjs/core/lib/esm/components/tabs/tabs';
import { Tab } from '@blueprintjs/core/lib/esm/components/tabs/tab';

import { User } from 'stores/user/Reducer';
import { getNotifications } from '../../../stores/notifications/Action';

import { companySubscriber } from 'helpers/notification/subscribers';
import { DepartmentView } from './department/View';
import { AdminRoleView } from './adminRole/View';
import { GeneralView } from './companyName/General';
import Navbar from 'components/navbar/Navbar';
import Subscriptions from './subscriptions/Index';
import ErrorText from './ErrorText';

import './styles.scss';

export const customStylesForModal = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

interface SettingsPageProps {
  user: User;
  notifications: any;
  read: number;
  companyId: string;
  getNotifications: any;
  companyRole: string;
  subscriptiontExpired: boolean;
}

const ViewContent = ({ selectedTab }) => {
  return (
    <div>
      {
        {
          1: <GeneralView />,
          2: <AdminRoleView />,
          3: <DepartmentView />,
          4: <Subscriptions />,
        }[selectedTab]
      }
    </div>
  );
};

const MobileView = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(1);
  const liClasses = 'pv2';

  return (
    <MobileOnlyView>
      <div className="mobile-nav w-100 tc">
        <ul className="flex flex-column list pl0">
          <li
            className={
              liClasses + (selectedTab === 1 ? ' activeNav' : '')
            }
            onClick={() => setSelectedTab(1)}
          >
            {t('app.company.Settings.General')}
          </li>
          <li
            className={
              liClasses + (selectedTab === 2 ? ' activeNav' : '')
            }
            onClick={() => setSelectedTab(2)}
          >
            {t('app.company.Settings.Role-Permission')}
          </li>
          <li
            className={
              liClasses + (selectedTab === 3 ? ' activeNav' : '')
            }
            onClick={() => setSelectedTab(3)}
          >
            {t('app.company.Settings.Departments')}
          </li>
          <li
            className={
              liClasses + (selectedTab === 4 ? ' activeNav' : '')
            }
            onClick={() => setSelectedTab(4)}
          >
            {t('app.company.Settings.Subscription')}
          </li>
        </ul>
      </div>
      <ViewContent selectedTab={selectedTab} />
    </MobileOnlyView>
  );
};

const SettingsPagComponent = (
  props: SettingsPageProps & RouteComponentProps,
) => {
  const { t } = useTranslation();
  const [success, setSuccess] = useState(false);

  function closeModal() {
    setSuccess(false);
  }
  useEffect(() => {
    setSuccess(props.subscriptiontExpired);
  }, [props.subscriptiontExpired]);

  return (
    <>
      {isMobileOnly && <Navbar type="company" />}
      <div className="fl w-100 pl4-ns pr2-ns ph3 pb4 mt5 mt0-ns">
        <div className="fl w-100">
          {isMobileOnly ? undefined : (
            <h3 className="f3 b">
              {t('app.company.Settings.Settings')}
            </h3>
          )}
        </div>
        {isMobileOnly ? (
          <MobileView />
        ) : (
          <Tabs
            id="TabsExample"
            className="fl w-100 min-vh-75"
            vertical={isMobileOnly ? false : true}
          >
            <Tab
              id="General"
              panelClassName={`b--black-05 ${
                isMobileOnly ? '' : 'bl'
              } bw1 ml3-ns ml1 w-100`}
              title={t('app.company.Settings.General')}
              panel={<GeneralView />}
              className="outline-0 f6-ns f7"
            />
            <Tab
              id="admin_role_permissions"
              panelClassName={`b--black-05 ${
                isMobileOnly ? '' : 'bl'
              } bw1 ml3-ns ml1 w-100`}
              title={t('app.company.Settings.Role-Permission')}
              panel={<AdminRoleView />}
              className="outline-0 f6-ns f7"
            />
            <Tab
              id="department"
              panelClassName={`b--black-05 ${
                isMobileOnly ? '' : 'bl'
              } bw1 ml3-ns ml1 w-100`}
              title={t('app.company.Settings.Departments')}
              panel={<DepartmentView />}
              className="outline-0 f6-ns f7"
            />
            {props.companyRole === 'superAdmin' && (
              <Tab
                id="subscription"
                panelClassName={`b--black-05 ${
                  isMobileOnly ? '' : 'bl'
                } bw1 ml3-ns ml1 w-100`}
                title={t('app.company.Settings.Subscription')}
                panel={<Subscriptions />}
                className="outline-0 f6-ns f7"
              />
            )}
          </Tabs>
        )}

        {success && (
          <Modal
            isOpen={success}
            // onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStylesForModal}
            contentLabel="Example Modal"
          >
            <ErrorText
              closeModal={closeModal}
              text={t('app.company.Settings.Expired')}
              subtext={t('app.company.Settings.Expired-text')}
            />
          </Modal>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    companyId: state.companyReducer.currentCompany._id,
    notifications: state.notificationReducer.allNotifications,
    read: state.notificationReducer.read,
    companyRole: state.companyReducer.currentCompany.role,
    subscriptiontExpired:
      state.subscriptionReducer.subscriptionExpired,
  };
};
export const SettingsPage = connect(mapStateToProps, {
  companySubscriber,
  getNotifications,
})(withRouter(SettingsPagComponent));

export default SettingsPage;
