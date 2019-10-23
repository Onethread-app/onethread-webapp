import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { CompanySettingsView } from 'components/company/settings/CompanySettings';

const SettingsPageComponent = () => (
  <div className="bg-white mh4 mv5 ">
    <Tabs
      id="TabsExample"
      className="pa2"
      vertical={true}
    >
      <Tab
        id="company_settings"
        title="Company Settings"
        panel={<CompanySettingsView />}
        className="outline-0 w-100"
      />
    </Tabs>
  </div>
);

export const SettingsPage = connect(null, null)(SettingsPageComponent)