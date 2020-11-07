import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import { MyProject } from './MyProjects';
import { PendingProjectRequest } from './request/Index';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { NavbarCompany } from 'components/NavbarCompany';
import { setProjectAccessForUser } from 'stores/project/Actions';

const _ProjectPage = (props: any) => {
  React.useEffect(() => {
    if (props.subscriptiontExpired) {
      props.company.role === 'superAdmin'
        ? window.location.replace(
            `${window.location.origin}/company/${props.company.uniqueName}/settings/`,
          )
        : window.location.replace(
            `${window.location.origin}/${props.user.name}/home`,
          );
    }
  }, []);

  React.useEffect(() => {
    props.setProjectAccessForUser(true);
  }, []);

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
    subscriptiontExpired:
      state.subscriptionReducer.subscriptionExpired,
    company: state.companyReducer.currentCompany,
    hasAccess: state.projectReducer.hasAccess,
  };
};

export const ProjectPage = connect(
  mapStateToProps,
  {setProjectAccessForUser},
)(withRouter(_ProjectPage));
