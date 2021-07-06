import React from 'react';
import {
  NavLink,
  withRouter,
  RouteComponentProps,
} from 'react-router-dom';
import { User } from 'stores/user/Reducer';
import { ICompany } from 'stores/company/Reducer';
import { connect } from 'react-redux';

import logo from 'resources/images/onethread-text.png';
import tigrowLogo from '../resources/images/TiGrowLogoFinal.png';
// import individualProfile from '../resources/images/sidebarIndividualProfile.svg';
import sidebarProfile from '../resources/images/sidebarProfile.svg';
import sidebarProfileLight from '../resources/images/sidebarProfile-light.svg';
import room from '../resources/images/sidebarRoom.svg';
import board from '../resources/images/sideBarBoard.svg';
import team from '../resources/images/sidebarTeam.svg';
import teamLight from '../resources/images/sidebarTeam-light.svg';
import settings from '../resources/images/sidebarSettings.svg';
import settingsLight from '../resources/images/sidebarSettings-light.svg';
import projects from '../resources/images/ProjectsIcon.svg';
import projectsLight from '../resources/images/ProjectsIcon-light.svg';
import associates from '../resources/images/sideBarAssociates.svg';
import associatesLight from '../resources/images/sideBarAssociates-light.svg';
import dashboard from '../resources/images/sideBarDashboard.svg';
import dashboardLight from '../resources/images/sideBarDashboard-light.svg';
import feedback from '../resources/images/feedback.svg';
import feedbackLight from '../resources/images/feedback-light.svg';

import preface from '../resources/images/sideBarPreface.svg';
import settingsProject from '../resources/images/sidebarProjectSettings.svg';
import teamProject from '../resources/images/sidebarProjectTeam.svg';

import { Tooltip, Divider } from '@blueprintjs/core';
import {
  companyPermit,
  unreadMessageNotification,
} from 'stores/UtilsActions';
// import { isEmpty } from 'lodash';
import { ICompanyRoom } from 'stores/room/Reducer';
import {
  clearProjectReducer,
  openProjectFIle,
} from 'stores/project/Actions';
import { useTranslation } from 'react-i18next';
// import { withRouter } from 'react-router';

interface ISideBarProps {
  user: User;
  company: ICompany;
  type: string;
  leftOpen: boolean;
  project: any;
  companyRooms: ICompanyRoom[];
  projectFileOpen: boolean;
  clearProjectReducer: () => void;
  openProjectFIle: (val: boolean) => void;
}

const _Sidebar = (props: ISideBarProps & RouteComponentProps) => {
  const [activeTab, setActiveTab] = React.useState('');

  React.useEffect(() => {
    props.type === 'default'
      ? setActiveTab('user-profile')
      : setActiveTab('company-dashboard');
  }, [props.type]);

  const { t } = useTranslation();

  return (
    <div
      style={{
        background: '#303053',
      }}
      className="main-sidebar"
    >
      <div
        className={`${props.leftOpen ? 'db ml4 mv3' : 'dn'} `}
        style={{ width: '6rem' }}
      >
        <NavLink to={`/${props.user.name}/home`}>
          {props.leftOpen ? (
            <img src={logo} alt="" />
          ) : (
            <img src={tigrowLogo} alt="" />
          )}
        </NavLink>
      </div>
      <div
        className={`${
          props.leftOpen ? 'pt4' : 'pt5'
        } pt4 flex flex-column justify-center items-center`}
      >
        {props.type === 'default' ? (
          <NavLink
            exact
            className="ma1 hover-bg-white-20 pa1 flex items-center nowrap w-100"
            style={{ color: 'white' }}
            activeStyle={{ background: ' #3484F0' }}
            onClick={() => setActiveTab('user-profile')}
            to={`/${props.user.name}`}
          >
            {props.leftOpen ? (
              <span className="ml4 pa1 bg-white">
                <img
                  src={
                    activeTab === 'user-profile'
                      ? sidebarProfileLight
                      : sidebarProfile
                  }
                  className="w1 pt1"
                  alt=""
                />
              </span>
            ) : (
              <Tooltip
                content={<p className="mb0">{t('app.company.Company-profile.Individual')}</p>}
                // content={<p className="mb0">Individual Profile</p>}
                position="right"
              >
                <span className="ml3 pa1 bg-white">
                  <img
                    src={
                      activeTab === 'user-profile'
                        ? sidebarProfileLight
                        : sidebarProfile
                    }
                    className="w1 pt1"
                    alt=""
                  />
                </span>
              </Tooltip>
            )}
            {props.leftOpen && (
              <span
                className="outline-0 bp3-large pl4"
                style={{
                  color: 'inherit',
                }}
              >
                {t('app.user.Personal-profile.Profile')}
                {/* Profile */}
              </span>
            )}
          </NavLink>
        ) : (
          <>
            {(companyPermit(props.company.role) ||
              props.company.role === 'employee') && (
              <NavLink
                exact
                className="flex items-center nowrap ma1 pa1 hover-bg-white-20 w-100"
                style={{ color: 'white' }}
                activeStyle={{ background: ' #3484F0' }}
                to={`/company/${props.company.uniqueName}/dashboard`}
                onClick={() => setActiveTab('company-dashboard')}
              >
                {props.leftOpen ? (
                  <span className="ml4 pa1 bg-white">
                    <img
                      src={
                        activeTab === 'company-dashboard'
                          ? dashboardLight
                          : dashboard
                      }
                      className="w1 pt1"
                      alt=""
                    />
                  </span>
                ) : (
                  <Tooltip
                    content={<p className="mb0">{t('app.company.Dashboard.Headline')}</p>}
                    // content={<p className="mb0">Dashboard</p>}
                    position="right"
                  >
                    <span className="ml3 pa1 bg-white">
                      <img
                        src={
                          activeTab === 'company-dashboard'
                            ? dashboardLight
                            : dashboard
                        }
                        className="w1 pt1"
                        alt=""
                      />
                    </span>
                  </Tooltip>
                )}
                {props.leftOpen && (
                  <span
                    className="outline-0 bp3-large pl4"
                    style={{ color: 'inherit' }}
                  >
                    {t('app.company.Dashboard.Headline')}
                    {/* Dashboard */}
                  </span>
                )}
              </NavLink>
            )}
            <NavLink
              exact
              className="flex items-center nowrap ma1 pa1 hover-bg-white-20 w-100"
              style={{ color: 'white' }}
              activeStyle={{ background: ' #3484F0' }}
              to={`/company/${props.company.uniqueName}/project`}
              onClick={() => setActiveTab('company-project')}
            >
              {props.leftOpen ? (
                <span className="ml4 pa1 bg-white">
                  <img
                    src={
                      activeTab === 'company-project'
                        ? projectsLight
                        : projects
                    }
                    className="w1 pt1"
                    alt=""
                  />
                </span>
              ) : (
                <Tooltip
                  content={<p className="mb0">{t('app.homepage.Projects')}</p>}
                  // content={<p className="mb0">Projects</p>}
                  position="right"
                >
                  <span className="ml3 pa1 bg-white">
                    <img
                      src={
                        activeTab === 'company-project'
                          ? projectsLight
                          : projects
                      }
                      className="w1 pt1"
                      alt=""
                    />
                  </span>
                </Tooltip>
              )}
              {props.leftOpen && (
                <>
                  <span
                    className="outline-0 bp3-large pl4"
                    style={{ color: 'inherit' }}
                  >
                    {t('app.homepage.Projects')}
                    {/* Projects */}
                  </span>
                  {props.companyRooms &&
                  unreadMessageNotification(
                    props.companyRooms,
                    'company',
                    props.company._id,
                  ) ? (
                    <span
                      className="ml1 br-100 bg-red"
                      style={{ width: '7px', height: '7px' }}
                    ></span>
                  ) : null}
                </>
              )}
            </NavLink>
            {/*  */}
            {props.projectFileOpen && (
              <div className="w-100 bg-white-10">
                {props.leftOpen ? (
                  <h1
                    className="f7 fw4 white pl4 pv2 pointer overflow-hidden"
                    style={{
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      width: '230px',
                    }}
                    onClick={async () => {
                      props.history.push(
                        `/company/${props.company.uniqueName}/project`,
                      );
                      await props.openProjectFIle(false);
                      if (props.project._id) {
                        await props.clearProjectReducer();
                      }
                    }}
                  >
                    {props.project.name}
                  </h1>
                ) : undefined}
                <Divider
                  style={{
                    borderRight: '1px groove darkgray',
                    borderBottom: '1px groove darkgray',
                  }}
                />
                <NavLink
                  exact
                  className="flex items-center nowrap ma1 pa1 hover-bg-white-20 w-100"
                  style={{ color: 'white' }}
                  activeStyle={{ background: ' #3484F0' }}
                  to={`/company/${props.company.uniqueName}/project/${props.project._id}/overview`}
                >
                  {props.leftOpen ? (
                    <span className="pl4">
                      <img
                        src={preface}
                        className="pt1"
                        style={{ width: '25px' }}
                        alt=""
                      />
                    </span>
                  ) : (
                    <Tooltip
                      content={<p className="mb0">{t('app.company.Projects.Overview')}</p>}
                      // content={<p className="mb0">Overview</p>}
                      position="right"
                    >
                      <span className="pl3">
                        <img
                          src={board}
                          className="pt1"
                          style={{ width: '25px' }}
                          alt=""
                        />
                      </span>
                    </Tooltip>
                  )}
                  {props.leftOpen && (
                    <span
                      className="outline-0 bp3-large pl3"
                      style={{ color: 'inherit' }}
                    >
                      {t('app.company.Projects.Overview')}
                      {/* Overview */}
                    </span>
                  )}
                </NavLink>

                <NavLink
                  exact
                  className="flex items-center nowrap ma1 pa1 hover-bg-white-20 w-100"
                  style={{ color: 'white' }}
                  activeStyle={{ background: ' #3484F0' }}
                  to={`/company/${props.company.uniqueName}/project/${props.project._id}`}
                >
                  {props.leftOpen ? (
                    <span className="pl4">
                      <img
                        src={preface}
                        className="pt1"
                        style={{ width: '25px' }}
                        alt=""
                      />
                    </span>
                  ) : (
                    <Tooltip
                      content={<p className="mb0">{t('app.project.Project-preface.Intro')}</p>}
                      // content={<p className="mb0">Preface</p>}
                      position="right"
                    >
                      <span className="pl3">
                        <img
                          src={preface}
                          className="pt1"
                          style={{ width: '25px' }}
                          alt=""
                        />
                      </span>
                    </Tooltip>
                  )}
                  {props.leftOpen && (
                    <span
                      className="outline-0 bp3-large pl3"
                      style={{ color: 'inherit' }}
                    >
                      {t('app.project.Project-preface.Intro')}
                      {/* Preface */}
                    </span>
                  )}
                </NavLink>
                <NavLink
                  exact
                  className="flex items-center nowrap ma1 pa1 hover-bg-white-20 w-100"
                  style={{ color: 'white' }}
                  activeStyle={{ background: ' #3484F0' }}
                  to={`/company/${props.company.uniqueName}/project/${props.project._id}/room`}
                >
                  {props.leftOpen ? (
                    <span className="pl4">
                      <img
                        src={room}
                        className="pt1"
                        style={{ width: '25px' }}
                        alt=""
                      />
                    </span>
                  ) : (
                    <Tooltip
                      content={<p className="mb0">{t('app.project.Project-rooms.Rooms')}</p>}
                      // content={<p className="mb0">Rooms</p>}
                      position="right"
                    >
                      <span className="pl3">
                        <img
                          src={room}
                          className="pt1"
                          style={{ width: '25px' }}
                          alt=""
                        />
                      </span>
                    </Tooltip>
                  )}
                  {props.leftOpen && (
                    <>
                      <span
                        className="outline-0 bp3-large pl3"
                        style={{ color: 'inherit' }}
                      >
                        {t('app.project.Project-rooms.Rooms')}
                        {/* Rooms */}
                      </span>
                      {props.companyRooms &&
                      unreadMessageNotification(
                        props.companyRooms,
                        'project',
                        props.project._id,
                      ) ? (
                        <span
                          className="ml1 br-100 bg-red"
                          style={{ width: '7px', height: '7px' }}
                        ></span>
                      ) : null}
                    </>
                  )}
                </NavLink>

                <NavLink
                  exact
                  className="flex items-center nowrap ma1 pa1 hover-bg-white-20 w-100"
                  style={{ color: 'white' }}
                  activeStyle={{ background: ' #3484F0' }}
                  to={`/company/${props.company.uniqueName}/project/${props.project._id}/board`}
                >
                  {props.leftOpen ? (
                    <span className="pl4">
                      <img
                        src={board}
                        className="pt1"
                        style={{ width: '25px' }}
                        alt=""
                      />
                    </span>
                  ) : (
                    <Tooltip
                      content={<p className="mb0">{t('app.project.Project-boards.Board')}</p>}
                      // content={<p className="mb0">Boards</p>}
                      position="right"
                    >
                      <span className="pl3">
                        <img
                          src={board}
                          className="pt1"
                          style={{ width: '25px' }}
                          alt=""
                        />
                      </span>
                    </Tooltip>
                  )}
                  {props.leftOpen && (
                    <span
                      className="outline-0 bp3-large pl3"
                      style={{ color: 'inherit' }}
                    >
                      {t('app.project.Project-boards.Board')}
                      {/* Boards */}
                    </span>
                  )}
                </NavLink>
                <NavLink
                  exact
                  className="flex items-center nowrap ma1 pa1 hover-bg-white-20 w-100"
                  style={{ color: 'white' }}
                  activeStyle={{ background: ' #3484F0' }}
                  to={`/company/${props.company.uniqueName}/project/${props.project._id}/team`}
                >
                  {props.leftOpen ? (
                    <span className="pl4">
                      <img
                        src={teamProject}
                        className="pt1"
                        style={{ width: '25px' }}
                        alt=""
                      />
                    </span>
                  ) : (
                    <Tooltip
                      content={<p className="mb0">{t('app.project.Project-teammates.Team-members')}</p>}
                      // content={<p className="mb0">Teammates</p>}
                      position="right"
                    >
                      <span className="pl3">
                        <img
                          src={teamProject}
                          className="pt1"
                          style={{ width: '25px' }}
                          alt=""
                        />
                      </span>
                    </Tooltip>
                  )}
                  {props.leftOpen && (
                    <span
                      className="outline-0 bp3-large pl3"
                      style={{ color: 'inherit' }}
                    >
                      {t('app.project.Project-teammates.Team-members')}
                      {/* Teammates */}
                    </span>
                  )}
                </NavLink>
                <NavLink
                  exact
                  className="flex items-center nowrap ma1 pa1 hover-bg-white-20 w-100"
                  style={{ color: 'white' }}
                  activeStyle={{ background: ' #3484F0' }}
                  to={`/company/${props.company.uniqueName}/project/${props.project._id}/settings`}
                >
                  {props.leftOpen ? (
                    <span className="pl4">
                      <img
                        src={settingsProject}
                        className="pt1"
                        style={{ width: '25px' }}
                        alt=""
                      />
                    </span>
                  ) : (
                    <Tooltip
                      content={
                        <p className="mb0">{t('app.company.Projects.Project-Settings')}</p>
                        // <p className="mb0">Project Settings</p>
                      }
                      position="right"
                    >
                      <span className="pl3">
                        <img
                          src={settingsProject}
                          className="pt1"
                          style={{ width: '25px' }}
                          alt=""
                        />
                      </span>
                    </Tooltip>
                  )}
                  {props.leftOpen && (
                    <span
                      className="outline-0 bp3-large pl3"
                      style={{ color: 'inherit' }}
                    >
                      {t('app.company.Projects.Project-Settings')}
                      {/* Project Settings */}
                    </span>
                  )}
                </NavLink>
              </div>
            )}
            {(companyPermit(props.company.role) ||
              props.company.role === 'employee') && (
              <NavLink
                exact
                className="flex items-center nowrap ma1 pa1 hover-bg-white-20 w-100"
                style={{ color: 'white' }}
                activeStyle={{ background: ' #3484F0' }}
                to={`/company/${props.company.uniqueName}`}
                onClick={() => setActiveTab('company-profile')}
              >
                {props.leftOpen ? (
                  <span className="ml4 pa1 bg-white">
                    <img
                      src={
                        activeTab === 'company-profile'
                          ? sidebarProfileLight
                          : sidebarProfile
                      }
                      className="w1 pt1"
                      alt=""
                    />
                  </span>
                ) : (
                  <Tooltip
                    content={<p className="mb0">{t('app.company.Company-profile.Company-profile')}</p>}
                    // content={<p className="mb0">Company Profile</p>}
                    position="right"
                  >
                    <span className="ml3 pa1 bg-white">
                      <img
                        src={
                          activeTab === 'company-profile'
                            ? sidebarProfileLight
                            : sidebarProfile
                        }
                        className="w1 pt1"
                        alt=""
                      />
                    </span>
                  </Tooltip>
                )}
                {props.leftOpen && (
                  <span
                    className="outline-0 bp3-large pl4"
                    style={{ color: 'inherit' }}
                  >
                    {t('app.company.Company-profile.Company-profile')}
                    {/*Company Profile */}
                  </span>
                )}
              </NavLink>
            )}
            {(companyPermit(props.company.role) ||
              props.company.role === 'employee') && (
              <NavLink
                exact
                className="flex items-center nowrap ma1 pa1 hover-bg-white-20 w-100"
                style={{ color: 'white' }}
                activeStyle={{ background: ' #3484F0' }}
                to={`/company/${props.company.uniqueName}/colleague`}
                onClick={() => setActiveTab('company-colleague')}
              >
                {props.leftOpen ? (
                  <span className="ml4 pa1 bg-white">
                    <img
                      src={
                        activeTab === 'company-colleague'
                          ? teamLight
                          : team
                      }
                      className="w1 pt1"
                      alt=""
                    />
                  </span>
                ) : (
                  <Tooltip
                    content={<p className="mb0">{t('app.company.Colleagues.Colleagues')}</p>}
                    // content={<p className="mb0">Colleagues</p>}
                    position="right"
                  >
                    <span className="ml3 pa1 bg-white">
                      <img
                        src={
                          activeTab === 'company-colleague'
                            ? teamLight
                            : team
                        }
                        className="w1 pt1"
                        alt=""
                      />
                    </span>
                  </Tooltip>
                )}
                {props.leftOpen && (
                  <span
                    className="outline-0 bp3-large pl4"
                    style={{ color: 'inherit' }}
                  >
                    {t('app.company.Colleagues.Colleagues')}
                    {/* Colleagues */}
                  </span>
                )}
              </NavLink>
            )}
            {companyPermit(props.company.role) && (
              <NavLink
                exact
                className="flex items-center nowrap ma1 pa1 hover-bg-white-20 w-100"
                style={{ color: 'white' }}
                activeStyle={{ background: ' #3484F0' }}
                to={`/company/${props.company.uniqueName}/associates`}
                onClick={() => setActiveTab('company-associates')}
              >
                {props.leftOpen ? (
                  <span className="ml4 pa1 bg-white">
                    <img
                      src={
                        activeTab === 'company-associates'
                          ? associatesLight
                          : associates
                      }
                      className="w1 pt1"
                      alt=""
                    />
                  </span>
                ) : (
                  <Tooltip
                    content={<p className="mb0">{t('app.company.Partners.Partners')}</p>}
                    // content={<p className="mb0">Partners</p>}
                    position="right"
                  >
                    <span className="ml3 pa1 bg-white">
                      <img
                        src={
                          activeTab === 'company-associates'
                            ? associatesLight
                            : associates
                        }
                        className="w1 pt1"
                        alt=""
                      />
                    </span>
                  </Tooltip>
                )}
                {props.leftOpen && (
                  <span
                    className="outline-0 bp3-large pl4"
                    style={{ color: 'inherit' }}
                  >
                    {t('app.company.Partners.Partners')}
                    {/* Partners */}
                  </span>
                )}
              </NavLink>
            )}
            {companyPermit(props.company.role) && (
              <NavLink
                exact
                className="flex items-center nowrap ma1 pa1 hover-bg-white-20 w-100"
                style={{ color: 'white' }}
                activeStyle={{ background: ' #3484F0' }}
                to={`/company/${props.company.uniqueName}/settings`}
                onClick={() => setActiveTab('company-settings')}
              >
                {props.leftOpen ? (
                  <span className="ml4 pa1 bg-white">
                    <img
                      src={
                        activeTab === 'company-settings'
                          ? settingsLight
                          : settings
                      }
                      className="w1 pt1"
                      alt=""
                    />
                  </span>
                ) : (
                  <Tooltip
                    content={<p className="mb0">{t('app.company.Settings.Settings')}</p>}
                    // content={<p className="mb0">Settings</p>}
                    position="right"
                  >
                    <span className="ml3 pa1 bg-white">
                      <img
                        src={
                          activeTab === 'company-settings'
                            ? settingsLight
                            : settings
                        }
                        className="w1 pt1"
                        alt=""
                      />
                    </span>
                  </Tooltip>
                )}
                {props.leftOpen && (
                  <span
                    className="outline-0 bp3-large pl4"
                    style={{ color: 'inherit' }}
                  >
                    {t('app.company.Settings.Settings')}
                  </span>
                )}
              </NavLink>
            )}
            {(companyPermit(props.company.role) ||
              props.company.role === 'employee') && (
              <NavLink
                exact
                className="flex items-center nowrap ma1 pa1 hover-bg-white-20 w-100"
                style={{ color: 'white' }}
                activeStyle={{ background: ' #3484F0' }}
                to={`/company/${props.company.uniqueName}/feedback`}
                onClick={() => setActiveTab('feedback')}
              >
                {props.leftOpen ? (
                  <span className="ml4 pa1 bg-white">
                    <img
                      src={
                        activeTab === 'feedback'
                          ? feedback
                          : feedbackLight
                      }
                      className="w1 pt1"
                      alt=""
                    />
                  </span>
                ) : (
                  <Tooltip
                    content={<p className="mb0">{t('app.company.Feedback.Feedback')}</p>}
                    // content={<p className="mb0">Feedback</p>}
                    position="right"
                  >
                    <span className="ml3 pa1 bg-white">
                      <img
                        src={
                          activeTab === 'feedback'
                            ? feedback
                            : feedbackLight
                        }
                        className="w1 pt1"
                        alt=""
                      />
                    </span>
                  </Tooltip>
                )}
                {props.leftOpen && (
                  <span
                    className="outline-0 bp3-large pl4"
                    style={{ color: 'inherit' }}
                  >
                    {t('app.company.Feedback.Feedback')}
                    {/* Feedback */}
                  </span>
                )}
              </NavLink>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    projectFileOpen: state.projectReducer.projectFileOpen,
  };
};

export const Sidebar = connect(mapStateToProps, {
  clearProjectReducer,
  openProjectFIle,
})(withRouter(_Sidebar));
