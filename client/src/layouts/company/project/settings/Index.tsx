import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { GeneralPage } from './General';
import { updateProjectRole } from '../../../../stores/project/Actions';
import { MobileView, isMobileOnly } from 'react-device-detect';
import { NavLink } from 'react-router-dom';
import { NavbarCompany } from 'components/NavbarCompany';

const ProjectSettingsPageComponent = (props: any) => {
  const onSubmit = async (values: any) => {
    await props.updateProjectRole(values.optionalRole);
  };

  return (
    <>
      <MobileView>
        <NavbarCompany title="Project Settings" />
        <div className="flex justify-between mt5">
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.name}/project/${props.project._id}`}
            activeStyle={{ background: '#3F61C5', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>Preface</small>
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.name}/project/${props.project._id}/room`}
            activeStyle={{ background: '#3F61C5', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>Room</small>
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.name}/project/${props.project._id}/board`}
            activeStyle={{ background: '#3F61C5', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>Board</small>
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.name}/project/${props.project._id}/team`}
            activeStyle={{ background: '#3F61C5', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>Team</small>
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.name}/project/${props.project._id}/settings`}
            activeStyle={{ background: '#3F61C5', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>Settings</small>
          </NavLink>
        </div>
      </MobileView>
      <div className="bg-white pa5-ns ph3 mb6">
<<<<<<< HEAD
<<<<<<< HEAD
        {isMobileOnly ? undefined : (
          <h3 className="f3 ma0">Project Settings</h3>
        )}
=======
        {isMobileOnly ? undefined : <h3 className="f3 ma0">Project Settings</h3>}
>>>>>>> a51ad486... Feature/mobile responsive (#148)
=======
        {isMobileOnly ? undefined : (
          <h3 className="f3 ma0">Project Settings</h3>
        )}
>>>>>>> 750029e8... Release/v2.2.0 (#183)
        <h3 className="f5 mv4">Project Moderator</h3>
        <Tabs id="TabsExample" vertical={true}>
          <Tab
            id="general"
            title="Permission"
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
