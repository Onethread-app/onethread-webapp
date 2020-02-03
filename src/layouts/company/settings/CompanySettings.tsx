import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import { useSelector } from 'react-redux';
import { permit } from 'stores/UtilsActions';
import { DepartmentView } from './FieldsView';
import { GeneralView } from './General';

export const CompanySettingsView = () => {
  const company = useSelector((state: any) => state.companyReducer.currentCompany);
  return (
    <div className="bl b--black-05 bw1 pl4-l pl3-m ml4-l" style={{ minHeight: '30em' }}>
      <div>
        {company.role && permit(company.role) ? (
          <Tabs
            id="TabsExample"
          >
            <Tab
              id="General"
              title="General"
              panel={<GeneralView />}
              className="outline-0"
            />
            <Tab
              id="fields"
              title="Fields"
              panel={<DepartmentView />}
              className="outline-0"
            />
          </Tabs>) : <h5 className="mv2 red">Restricted for {company.role}</h5>}
      </div>
    </div>
  );
};
