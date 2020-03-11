import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import { GeneralView } from './companyName/General';
import { DepartmentView } from './department/View';
import { AdminRoleView } from './adminRole/View';

export const SettingsPage = () => (
  <div className="fl w-100 pl4 pr2 pb4">
    <div className="fl w-100">
      <h3 className="f3 b">Settings</h3>
    </div>
    <Tabs
      id="TabsExample"
      className="fl w-100 min-vh-75"
      vertical={true}
    >
      <Tab
        id="General"
        panelClassName="b--black-05 bl bw1 ml3 w-100"
        title="General"
        panel={<GeneralView />}
        className="outline-0"
      />
      <Tab
        id="admin_role_permissions"
        panelClassName="b--black-05 bl bw1 ml3 w-100"
        title="Role Permissions"
        panel={<AdminRoleView />}
        className="outline-0 w-100"
      />
      <Tab
        id="department"
        panelClassName="b--black-05 bl bw1 ml3 w-100"
        title="Department"
        panel={<DepartmentView />}
        className="outline-0"
      />
    </Tabs>
  </div>
);