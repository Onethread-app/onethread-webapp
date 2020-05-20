import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import { MyProject } from './MyProjects';
import { PendingProjectRequest } from './request/Index';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { NavbarCompany } from 'components/NavbarCompany';

const _ProjectPage = (props: any) => {
  return (
    <>
      <NavbarCompany title="My Projects" />
      <div className="ph5-ns ph4 pt5 pt0-ns">
        <Tabs id="TabsExample">
          <Tab
            id="MyProjects"
            title="My Projects"
            panel={<MyProject />}
            className="outline-0 mt4-ns mt2"
          />
          {props.companyRole !== 'employee' && (
            <Tab
              id="PendingProject"
              title="Pending Projects"
              panel={<PendingProjectRequest />}
              className="outline-0 mt4-ns mt2"
            />
          )}
        </Tabs>
      </div>
    </>
  );
};
const mapStateToProps = (state: any) => {
  return {
    companyRole: state.companyReducer.currentCompany.role,
    PendingProjects: state.projectReducer.pendingProjects,
    user: state.userReducer.user,
  };
};

export const ProjectPage = connect(
  mapStateToProps,
  {},
)(withRouter(_ProjectPage));
