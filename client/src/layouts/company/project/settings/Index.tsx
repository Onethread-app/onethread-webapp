import React from 'react';
import { useTranslation } from 'react-i18next';
import { MobileView, isMobileOnly } from 'react-device-detect';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { Tabs } from '@blueprintjs/core/lib/esm/components/tabs/tabs';
import { Tab } from '@blueprintjs/core/lib/esm/components/tabs/tab';

import { updateProjectRole } from '../../../../stores/project/Actions';

import { GeneralPage } from './General';
import Navbar from 'components/navbar/Navbar';

const ProjectSettingsPageComponent = (props: any) => {
  const { t } = useTranslation();

  const onSubmit = async (values: any) => {
    await props.updateProjectRole(values.optionalRole);
  };

  return (
    <>
      <MobileView>
        <Navbar type="company" />
        <div className="flex justify-between mt5">
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.uniqueName}/project/${props.project._id}/overview`}
            activeStyle={{ background: '#34b3e9', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>
              {t('app.company.Projects.Overview')}
            </small>
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.uniqueName}/project/${props.project._id}`}
            activeStyle={{ background: '#34b3e9', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>
              {t('app.project.Project-preface.Intro')}
            </small>
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.uniqueName}/project/${props.project._id}/room`}
            activeStyle={{ background: '#34b3e9', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>
              {t('app.project.Project-rooms.Rooms')}
            </small>
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.uniqueName}/project/${props.project._id}/board`}
            activeStyle={{ background: '#34b3e9', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>
              {t('app.project.Project-boards.Board')}
            </small>
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.uniqueName}/project/${props.project._id}/team`}
            activeStyle={{ background: '#34b3e9', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>
              {t('app.project.Project-teammates.Team-members')}
            </small>
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.uniqueName}/project/${props.project._id}/settings`}
            activeStyle={{ background: '#34b3e9', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>
              {t('app.company.Projects.Project-Settings')}
            </small>
          </NavLink>
        </div>
      </MobileView>
      <div className="bg-white pa5-ns ph3 mb6">
        {isMobileOnly ? undefined : (
          <h3 className="f3 ma0">
            {t('app.company.Projects.Project-Settings')}
          </h3>
        )}
        <h3 className="f5 mv4">
          {t('app.project.Project-settings.Moderator')}
        </h3>
        <Tabs id="TabsExample" vertical={true}>
          <Tab
            id="general"
            title={t('app.project.Project-settings.Permission')}
            panel={<GeneralPage onSubmit={onSubmit} />}
            className="outline-0 w-100"
          />
        </Tabs>
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    optionalRole: state.companyReducer.currentCompany.optionalRole,
    companyRole: state.companyReducer.currentCompany.role,
    user: state.userReducer.user,
    company: state.companyReducer.currentCompany,
    project: state.projectReducer.projectDetails,
  };
};

export const ProjectSettingsPage = connect(mapStateToProps, {
  updateProjectRole,
})(ProjectSettingsPageComponent);

export default ProjectSettingsPage;
