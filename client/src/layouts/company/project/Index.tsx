import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setProjectAccessForUser } from 'stores/project/Actions';
import { CompletedProjects } from './CompletedProjects';
import { MyProject } from './MyProjects';
import { PendingProjectRequest } from './request/Index';
import { Tab, Tabs } from '@blueprintjs/core';
import Navbar from 'components/navbar/Navbar';
import { isMobileOnly } from 'react-device-detect';

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

  const { t } = useTranslation();

  return (
    <>
      {isMobileOnly && <Navbar type="company" />}
      <div className="ph5-ns ph4 pt5 pt0-ns">
        <Tabs id="TabsExample">
          <Tab
            id="MyProjects"
            title={t('app.company.Projects.My-projects')}
            // title="My Projects"
            panel={<MyProject />}
            className="outline-0 mt4-ns mt2"
          />
          <Tab
            id="CompletedProjects"
            title={t('app.company.Projects.Completed-projects')}
            // title="Completed Projects"
            panel={<CompletedProjects />}
            className="outline-0 mt4-ns mt2"
          />
          {props.companyRole !== 'employee' && (
            <Tab
              id="PendingProject"
              title={t('app.company.Projects.Pending Projects')}
              // title="Pending Projects"
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

export const ProjectPage = connect(mapStateToProps, {
  setProjectAccessForUser,
})(withRouter(_ProjectPage));
