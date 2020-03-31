import React from 'react';
import { NavLink } from 'react-router-dom';
import { User } from 'stores/user/Reducer';
import { ICompany } from 'stores/company/Reducer';

import logo from '../resources/images/TiGrowLogoFinal.png';
import tigrowLogo from '../resources/images/TiGrowLogoFinal.png';
import individualProfile from '../resources/images/sidebarIndividualProfile.svg';
import companyProfile from '../resources/images/sidebarCompanyProfile.svg';
import room from '../resources/images/sidebarRoom.svg';
import board from '../resources/images/sideBarBoard.svg';
import team from '../resources/images/sidebarTeam.svg';
import settings from '../resources/images/sidebarSettings.svg';
import projects from '../resources/images/ProjectsIcon.svg';
import associates from '../resources/images/sideBarAssociates.svg';
import dashboard from '../resources/images/sideBarDashboard.svg';

import preface from '../resources/images/sideBarPreface.svg';
import settingsProject from '../resources/images/sidebarProjectSettings.svg';
import teamProject from '../resources/images/sidebarProjectTeam.svg';

import { Tooltip, Divider } from '@blueprintjs/core';
import { companyPermit, unreadMessageNotification } from 'stores/UtilsActions';
import { isEmpty } from 'lodash';
import { ICompanyRoom } from 'stores/room/Reducer';

export const Sidebar = (props: {
  user: User;
  company: ICompany;
  type: string;
  leftOpen: boolean;
  project: any;
  companyRooms: ICompanyRoom[];
}) => {
  return (
    <div
      style={{
        background: '#060517'
      }}
    >
      <div
        className={`${props.leftOpen ? 'db ml4 mv3' : 'dn'} `}
        style={{ width: '6rem' }}
      >
        <NavLink to={`/company/${props.company.name}`}>
          {props.leftOpen ? <img src={logo} /> : <img src={tigrowLogo} />}
        </NavLink>
      </div>
      <div className={`${props.leftOpen ? 'pt4' : 'pt5'}`}>
        {props.type === 'default' ? (
          <NavLink
            exact
            className="ma1 hover-bg-white-20 flex items-center nowrap"
            style={{ color: 'white' }}
            activeStyle={{ background: '#3F61C5' }}
            to={`/${props.user.name}`}
          >
            {props.leftOpen ? (
              <span className="pl4">
                <img src={individualProfile} className="w2 pt1" />
              </span>
            ) : (
                <Tooltip
                  content={<p className="mb0">Individual Profile</p>}
                  position="right"
                >
                  <span className="pl3">
                    <img src={individualProfile} className="w2 pt1" />
                  </span>
                </Tooltip>
              )}
            {props.leftOpen && (
              <span
                className="outline-0 bp3-large pl4"
                style={{
                  color: 'inherit'
                }}
              >
                Profile
              </span>
            )}
          </NavLink>
        ) : (
            <>
              <NavLink
                exact
                className="flex items-center nowrap ma1 hover-bg-white-20"
                style={{ color: 'white' }}
                activeStyle={{ background: '#3F61C5' }}
                to={`/company/${props.company.name}/dashboard`}
              >
                {props.leftOpen ? (
                  <span className="pl4">
                    <img src={dashboard} className="w2 pt1" />
                  </span>
                ) : (
                    <Tooltip
                      content={<p className="mb0">Dashboard</p>}
                      position="right"
                    >
                      <span className="pl3">
                        <img src={dashboard} className="w2 pt1" />
                      </span>
                    </Tooltip>
                  )}
                {props.leftOpen && (
                  <span
                    className="outline-0 bp3-large pl4"
                    style={{ color: 'inherit' }}
                  >
                    Dashboard
                  </span>
                )}
              </NavLink>
              <NavLink
                exact
                className="flex items-center nowrap ma1 hover-bg-white-20"
                style={{ color: 'white' }}
                activeStyle={{ background: '#3F61C5' }}
                to={`/company/${props.company.name}`}
              >
                {props.leftOpen ? (
                  <span className="pl4">
                    <img src={companyProfile} className="w2 pt1" />
                  </span>
                ) : (
                    <Tooltip
                      content={<p className="mb0">Company Profile</p>}
                      position="right"
                    >
                      <span className="pl3">
                        <img src={companyProfile} className="w2 pt1" />
                      </span>
                    </Tooltip>
                  )}
                {props.leftOpen && (
                  <span
                    className="outline-0 bp3-large pl4"
                    style={{ color: 'inherit' }}
                  >
                    Profile
                  </span>
                )}
              </NavLink>
              <NavLink
                exact
                className="flex items-center nowrap ma1 hover-bg-white-20"
                style={{ color: 'white' }}
                activeStyle={{ background: '#3F61C5' }}
                to={`/company/${props.company.name}/colleague`}
              >
                {props.leftOpen ? (
                  <span className="pl4">
                    <img src={team} className="w2 pt1" />
                  </span>
                ) : (
                    <Tooltip
                      content={<p className="mb0">Colleague</p>}
                      position="right"
                    >
                      <span className="pl3">
                        <img src={team} className="w2 pt1" />
                      </span>
                    </Tooltip>
                  )}
                {props.leftOpen && (
                  <span
                    className="outline-0 bp3-large pl4"
                    style={{ color: 'inherit' }}
                  >
                    Colleague
                  </span>
                )}
              </NavLink>
              {companyPermit(props.company.role) && (
                <NavLink
                  exact
                  className="w-100 flex items-center nowrap ma1 hover-bg-white-20"
                  style={{ color: 'white' }}
                  activeStyle={{ background: '#3F61C5' }}
                  to={`/company/${props.company.name}/settings`}
                >
                  {props.leftOpen ? (
                    <span className="pl4">
                      <img src={settings} className="w2 pt1" />
                    </span>
                  ) : (
                      <Tooltip
                        content={<p className="mb0">Settings</p>}
                        position="right"
                      >
                        <span className="pl3">
                          <img src={settings} className="w2 pt1" />
                        </span>
                      </Tooltip>
                    )}
                  {props.leftOpen && (
                    <span
                      className="outline-0 bp3-large pl4"
                      style={{ color: 'inherit' }}
                    >
                      Settings
                    </span>
                  )}
                </NavLink>
              )}
              <NavLink
                exact
                className="w-100 flex items-center nowrap ma1 hover-bg-white-20"
                style={{ color: 'white' }}
                activeStyle={{ background: '#3F61C5' }}
                to={`/company/${props.company.name}/project`}
              >
                {props.leftOpen ? (
                  <span className="pl4">
                    <img src={projects} className="w2 pt1" />
                  </span>
                ) : (
                    <Tooltip
                      content={<p className="mb0">Project</p>}
                      position="right"
                    >
                      <span className="pl3">
                        <img src={projects} className="w2 pt1" />
                      </span>
                    </Tooltip>
                  )}
                {props.leftOpen && (
                  <>
                    <span
                      className="outline-0 bp3-large pl4"
                      style={{ color: 'inherit' }}
                    >
                      Project
                  </span>
                    {props.companyRooms &&
                      unreadMessageNotification(
                        props.companyRooms,
                        'company',
                        props.company._id
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
              {isEmpty(props.project._id) === false && (
                <div className="bg-white-10">
                  <h1 className="f7 fw4 white pl4 pv2">{props.project.name}</h1>
                  <Divider
                    style={{
                      borderRight: '1px groove darkgray',
                      borderBottom: '1px groove darkgray'
                    }}
                  />
                  <NavLink
                    exact
                    className="w-100 flex items-center nowrap ma1 hover-bg-white-20"
                    style={{ color: 'white' }}
                    activeStyle={{ background: '#3F61C5' }}
                    to={`/company/${props.company.name}/project/${props.project._id}`}
                  >
                    {props.leftOpen ? (
                      <span className="pl4">
                        <img
                          src={preface}
                          className="pt1"
                          style={{ width: '25px' }}
                        />
                      </span>
                    ) : (
                        <Tooltip
                          content={<p className="mb0">Preface</p>}
                          position="right"
                        >
                          <span className="pl3">
                            <img
                              src={preface}
                              className="pt1"
                              style={{ width: '25px' }}
                            />
                          </span>
                        </Tooltip>
                      )}
                    {props.leftOpen && (
                      <span
                        className="outline-0 bp3-large pl4"
                        style={{ color: 'inherit' }}
                      >
                        Preface
                      </span>
                    )}
                  </NavLink>
                  <NavLink
                    exact
                    className="w-100 flex items-center nowrap ma1 hover-bg-white-20"
                    style={{ color: 'white' }}
                    activeStyle={{ background: '#3F61C5' }}
                    to={`/company/${props.company.name}/project/${props.project._id}/room`}
                  >
                    {props.leftOpen ? (
                      <span className="pl4">
                        <img
                          src={room}
                          className="pt1"
                          style={{ width: '25px' }}
                        />
                      </span>
                    ) : (
                        <Tooltip
                          content={<p className="mb0">Room</p>}
                          position="right"
                        >
                          <span className="pl3">
                            <img
                              src={room}
                              className="pt1"
                              style={{ width: '25px' }}
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
                          Room
                      </span>
                        {props.companyRooms &&
                          unreadMessageNotification(
                            props.companyRooms,
                            'project',
                            props.project._id
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
                    className="flex items-center nowrap ma1 hover-bg-white-20"
                    style={{ color: 'white' }}
                    activeStyle={{ background: '#3F61C5' }}
                    to={`/company/${props.company.name}/project/${props.project._id}/board`}
                  >
                    {props.leftOpen ? (
                      <span className="pl4">
                        <img src={board} className="pt1" 
                        style={{ width: '25px' }}
                        />
                      </span>
                    ) : (
                        <Tooltip
                          content={<p className="mb0">Board</p>}
                          position="right"
                        >
                          <span className="pl3">
                            <img src={board} className="pt1" 
                            style={{ width: '25px' }}
                            />
                          </span>
                        </Tooltip>
                      )}
                    {props.leftOpen && (
                      <span
                        className="outline-0 bp3-large pl4"
                        style={{ color: 'inherit' }}
                      >
                        Board
                      </span>
                    )}
                  </NavLink>
                  <NavLink
                    exact
                    className="w-100 flex items-center nowrap ma1 hover-bg-white-20"
                    style={{ color: 'white' }}
                    activeStyle={{ background: '#3F61C5' }}
                    to={`/company/${props.company.name}/project/${props.project._id}/team`}
                  >
                    {props.leftOpen ? (
                      <span className="pl4">
                        <img
                          src={teamProject}
                          className="pt1"
                          style={{ width: '25px' }}
                        />
                      </span>
                    ) : (
                        <Tooltip
                          content={<p className="mb0">Team</p>}
                          position="right"
                        >
                          <span className="pl3">
                            <img
                              src={teamProject}
                              className="pt1"
                              style={{ width: '25px' }}
                            />
                          </span>
                        </Tooltip>
                      )}
                    {props.leftOpen && (
                      <span
                        className="outline-0 bp3-large pl4"
                        style={{ color: 'inherit' }}
                      >
                        Team
                      </span>
                    )}
                  </NavLink>
                  <NavLink
                    exact
                    className="w-100 flex items-center nowrap ma1 hover-bg-white-20"
                    style={{ color: 'white' }}
                    activeStyle={{ background: '#3F61C5' }}
                    to={`/company/${props.company.name}/project/${props.project._id}/settings`}
                  >
                    {props.leftOpen ? (
                      <span className="pl4">
                        <img
                          src={settingsProject}
                          className="pt1"
                          style={{ width: '25px' }}
                        />
                      </span>
                    ) : (
                        <Tooltip
                          content={<p className="mb0">Settings</p>}
                          position="right"
                        >
                          <span className="pl3">
                            <img
                              src={settingsProject}
                              className="pt1"
                              style={{ width: '25px' }}
                            />
                          </span>
                        </Tooltip>
                      )}
                    {props.leftOpen && (
                      <span
                        className="outline-0 bp3-large pl4"
                        style={{ color: 'inherit' }}
                      >
                        Settings
                      </span>
                    )}
                  </NavLink>
                </div>
              )}
              {/*  */}
              {companyPermit(props.company.role) && (
                <NavLink
                  exact
                  className="w-100 flex items-center nowrap ma1 hover-bg-white-20"
                  style={{ color: 'white' }}
                  activeStyle={{ background: '#3F61C5' }}
                  to={`/company/${props.company.name}/associates`}
                >
                  {props.leftOpen ? (
                    <span className="pl4">
                      <img src={associates} className="w2 pt1" />
                    </span>
                  ) : (
                      <Tooltip
                        content={<p className="mb0">Associates</p>}
                        position="right"
                      >
                        <span className="pl3">
                          <img src={settings} className="w2 pt1" />
                        </span>
                      </Tooltip>
                    )}
                  {props.leftOpen && (
                    <span
                      className="outline-0 bp3-large pl4"
                      style={{ color: 'inherit' }}
                    >
                      Associates
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
