import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import { GeneralView } from './companyName/General';
import { DepartmentView } from './department/View';
import { AdminRoleView } from './adminRole/View';
import { isMobileOnly } from 'react-device-detect';
import { User } from 'stores/user/Reducer';
import { connect } from 'react-redux';
import { companySubscriber } from 'layouts/company/notification/subscribers';
import { readNotification } from '../../../stores/notifications/Action';
import { getNotifications } from '../../../stores/notifications/Action';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { NavbarCompany } from 'components/NavbarCompany';

interface SettingsPageProps {
  user: User;
  notifications: any;
  read: number;
  companyId: string;
  readNotification: any;
  getNotifications: any;
}

const SettingsPagComponent = (
  props: SettingsPageProps & RouteComponentProps,
) => {
  return (
    <>
      <NavbarCompany title="My Settings" />
      <div className="fl w-100 pl4-ns pr2-ns ph3 pb4 mt5 mt0-ns">
        <div className="fl w-100">
          {isMobileOnly ? undefined : (
            <h3 className="f3 b">Settings</h3>
          )}
        </div>
        <Tabs
          id="TabsExample"
          className="fl w-100 min-vh-75"
          vertical={true}
        >
          <Tab
            id="General"
            panelClassName="b--black-05 bl bw1 ml3-ns ml1 w-100"
            title="General"
            panel={<GeneralView />}
            className="outline-0 f6-ns f7"
          />
          <Tab
            id="admin_role_permissions"
            panelClassName="b--black-05 bl bw1 ml3-ns ml1 w-100"
            title="Role Permissions"
            panel={<AdminRoleView />}
            className="outline-0 w-100 f6-ns f7"
          />
          <Tab
            id="department"
            panelClassName="b--black-05 bl bw1 ml3-ns ml1 w-100"
            title="Department"
            panel={<DepartmentView />}
            className="outline-0 f6-ns f7"
          />
        </Tabs>
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
  };
};
export const SettingsPage = connect(mapStateToProps, {
  companySubscriber,
  readNotification,
  getNotifications,
})(withRouter(SettingsPagComponent));
