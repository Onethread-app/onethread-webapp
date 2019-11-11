import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { CompanySettingsView } from 'components/company/settings/CompanySettings';

const SettingsPageComponent = () => (
  <div className="bg-white mh4 mv5 br3 pa4 h-75 shadow-4 w-90">
    <Tabs
      id="TabsExample"
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