import React from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { isMobileOnly } from 'react-device-detect';
import { connect } from 'react-redux';

import { Tabs } from '@blueprintjs/core/lib/esm/components/tabs/tabs';
import { Tab } from '@blueprintjs/core/lib/esm/components/tabs/tab';

import { setProjectAccessForUser } from 'stores/project/Actions';

import { MyProject } from './MyProjects';
import Navbar from 'components/navbar/Navbar';
import { PendingProjectRequest } from './request/Index';
import { CompletedProjects } from './CompletedProjects';
import ArchivedProjects from './ArchivedProjects';

import './Index.scss';

const _ProjectPage = (props: any) => {
  const { t } = useTranslation();

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
      {isMobileOnly && <Navbar type="company" />}
      <div className="ph5-ns ph4 pt5 pt0-ns h-100">
        <Tabs id="TabsExample" className="h-100">
          <Tab
            id="MyProjects"
            title={t('app.company.Projects.My-projects')}
            panel={<MyProject />}
            className="outline-0 mt4-ns mt2"
          />
          <Tab
            id="CompletedProjects"
            title={t('app.company.Projects.Completed-projects')}
            panel={<CompletedProjects />}
            className="outline-0 mt4-ns mt2"
          />
          {props.companyRole !== 'employee' && (
            <Tab
              id="ArchivedProjects"
              title={t('app.company.Projects.Archived-projects')}
              panel={<ArchivedProjects />}
              className="outline-0 mt4-ns mt2"
            />
          )}
          {props.companyRole !== 'employee' && (
            <Tab
              id="PendingProject"
              title={t('app.company.Projects.Pending Projects')}
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

export default ProjectPage;
