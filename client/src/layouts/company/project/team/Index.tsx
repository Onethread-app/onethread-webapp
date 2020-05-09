import React, { useState, useEffect } from 'react';
import {
  Button,
  HTMLTable,
  Popover,
  Position,
  Icon,
  Dialog,
  ButtonGroup,
  Alignment
} from '@blueprintjs/core';
import { connect } from 'react-redux';
import { ICompany } from 'stores/company/Reducer';
import { User } from 'stores/user/Reducer';
import { AddProjectMemberForm } from './AddProjectMemberForm';
import { AddProjectAssociateForm } from './AddProjectAssociateForm';
import { AssociateList } from './AssociateList';
import {
  getProjectTeams,
  changeProjectMemberRole,
} from 'stores/project/Actions';
import { IProjectTeam } from 'stores/project/Reducer';
import {
  getDivisionName,
  showDepartment,
} from 'layouts/company/colleagues/Index';
import { isEmpty, isEqual } from 'lodash';
import { Associate } from 'stores/associate/Reducer';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { MobileView, isMobileOnly } from 'react-device-detect';
import { NavLink } from 'react-router-dom';
import { NavbarCompany } from 'components/NavbarCompany';
=======
>>>>>>> c885f026... add associates in the project (#19)
=======
import { MobileView, isMobileOnly } from 'react-device-detect';
import { NavLink } from 'react-router-dom';
import { NavbarCompany } from 'components/NavbarCompany';
>>>>>>> a51ad486... Feature/mobile responsive (#148)
=======
>>>>>>> f4601c6e... add associates in the project (#19)
=======
import { MobileView, isMobileOnly } from 'react-device-detect';
import { NavLink } from 'react-router-dom';
import { NavbarCompany } from 'components/NavbarCompany';
>>>>>>> 2650e2be... Feature/mobile responsive (#148)

interface TeamMember {
  company: ICompany;
  user: User;
  teams: IProjectTeam[];
  associates: Associate[];
  companyRole: string;
  projectRole: string;
  getProjectTeams: () => void;
  changeProjectMemberRole: (
    values: { role: string },
    memberId: string,
    accountId: string,
  ) => void;
  project: any;
<<<<<<< HEAD
  projectList: Array<{ _id: string; company: string }>;
=======
>>>>>>> a51ad486... Feature/mobile responsive (#148)
}

const load = async (_getProjectTeams: () => void) => {
  await _getProjectTeams();
};

const ProjectTeamPageComponent = (props: TeamMember) => {
  const [showDialog, setShowDialog] = useState(false);
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  const [showAssociateDialog, setShowAssociateDialog] = useState(
    false,
  );
=======
  const [showAssociateDialog, setShowAssociateDialog] = useState(false);
>>>>>>> c885f026... add associates in the project (#19)
=======
  const [showAssociateDialog, setShowAssociateDialog] = useState(
    false,
  );
>>>>>>> d06346b0... code style issue fixed
=======
  const [showAssociateDialog, setShowAssociateDialog] = useState(false);
>>>>>>> f4601c6e... add associates in the project (#19)
=======
  const [showAssociateDialog, setShowAssociateDialog] = useState(
    false,
  );
>>>>>>> 4e99f05f... code style issue fixed
  const [adminList, setAdminList] = useState<IProjectTeam[]>([]);
  const [moderatorList, setModeratorList] = useState<IProjectTeam[]>(
    [],
  );
  const [teamList, setTeamList] = useState<IProjectTeam[]>([]);

  useEffect(() => {
    load(props.getProjectTeams);
  }, []);

  useEffect(() => {
    if (props.teams.length) {
      const a: IProjectTeam[] = [];
      const m: IProjectTeam[] = [];
      const t: IProjectTeam[] = [];
      props.teams.forEach((e) => {
        if (e.role === 'admin') {
          a.push(e);
        } else if (e.role === 'projectModerator') {
          m.push(e);
        } else if (e.role === 'member') {
          t.push(e);
        }
      });
      setAdminList(a);
      setModeratorList(m);
      setTeamList(t);
    }
  }, [props.teams]);

  return (
    <>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a51ad486... Feature/mobile responsive (#148)
=======
>>>>>>> 2650e2be... Feature/mobile responsive (#148)
      <MobileView>
        <NavbarCompany title="Team Members" />
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
<<<<<<< HEAD
=======
      <div className="ph5">
=======
        </div>
      </MobileView>
      <div className="ph5-ns ph3 pv4">
>>>>>>> 2650e2be... Feature/mobile responsive (#148)
        <div className="flex justify-between items-center">
          {isMobileOnly ? undefined : <h1 className="f3">Team Members</h1>}
          <div>
            <Button
              className="grow fr h2 pointer white bp3-minimal"
              style={{
                background: '#0fa3a3',
                outline: 'none',
                color: 'white',
              }}
              onClick={() => setShowDialog(!showDialog)}
            >
              Add Team Members
            </Button>
            <Button
              className="grow fr h2 pointer white bp3-minimal mr2"
              style={{
                background: 'none',
                border: '#0fa3a3',
                borderWidth: 1,
                borderStyle: 'solid',
                color: '#0fa3a3',
              }}
              onClick={() =>
                setShowAssociateDialog(!showAssociateDialog)
              }
            >
              Add Associates
            </Button>
          </div>
>>>>>>> f4601c6e... add associates in the project (#19)
        </div>
      </MobileView>
      <div className="ph5-ns ph3 pv4">
<<<<<<< HEAD
        <div className="flex justify-between items-center">
          {isMobileOnly ? undefined : (
            <h1 className="f3">Team Members</h1>
          )}
=======
      <div className="ph5">
        <div className="flex justify-between items-center">
          <h1 className="f3">Team Members</h1>
>>>>>>> c885f026... add associates in the project (#19)
=======
        <div className="flex justify-between items-center">
<<<<<<< HEAD
          {isMobileOnly ? undefined : <h1 className="f3">Team Members</h1>}
>>>>>>> a51ad486... Feature/mobile responsive (#148)
=======
          {isMobileOnly ? undefined : (
            <h1 className="f3">Team Members</h1>
          )}
>>>>>>> 750029e8... Release/v2.2.0 (#183)
          <div>
            <Button
              className="grow fr h2 pointer white bp3-minimal"
              style={{
                background: '#0fa3a3',
                outline: 'none',
                color: 'white',
              }}
              onClick={() => setShowDialog(!showDialog)}
            >
              Add Team Members
            </Button>
<<<<<<< HEAD
            {props.projectList &&
              props.projectList.map((project) =>
                props.project._id === project._id ? (
                  project.company === props.company._id ? (
                    <Button
                      className="grow fr h2 pointer white bp3-minimal mr2"
                      style={{
                        background: 'none',
                        border: '#0fa3a3',
                        borderWidth: 1,
                        borderStyle: 'solid',
                        color: '#0fa3a3',
                      }}
                      onClick={() =>
                        setShowAssociateDialog(!showAssociateDialog)
                      }
                    >
                      Add Associates
                    </Button>
                  ) : undefined
                ) : undefined,
              )}
=======
            <Button
              className="grow fr h2 pointer white bp3-minimal mr2"
              style={{
                background: 'none',
                border: '#0fa3a3',
                borderWidth: 1,
                borderStyle: 'solid',
                color: '#0fa3a3',
              }}
              onClick={() =>
                setShowAssociateDialog(!showAssociateDialog)
              }
            >
              Add Associates
            </Button>
>>>>>>> c885f026... add associates in the project (#19)
          </div>
        </div>
        {/* Admins list starts */}
        <h1 className="f4 mt4">Admins</h1>
        <HTMLTable className="w-100 mv3" striped={true}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Division</th>
              <th>Department</th>
              <th>Position</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {adminList.length ? (
              adminList.map(({ _id, member }) => (
                <tr key={_id}>
                  <td style={{ width: '24%' }}>
                    {member.account.name}
                  </td>
                  <td style={{ width: '24%' }}>
                    {member.designations.length
                      ? getDivisionName[
                      member.designations[0].division
                      ]
                      : null}
                  </td>
                  <td style={{ width: '24%' }}>
                    {showDepartment(member)}
                  </td>
                  <td style={{ width: '24%' }}>
                    {member.designations.length
                      ? member.designations[0].position
                      : null}
                  </td>
                  <td style={{ width: '4%' }}>
                    {isEqual(props.companyRole, 'superAdmin') ||
                      (!isEmpty(props.projectRole) &&
                        isEqual(props.projectRole, 'admin')) ? (
                        <Popover
                          className="fr"
                          position={Position.BOTTOM}
                          popoverClassName="bp3-popover-content-sizing bg-white"
                          content={
                            <ButtonGroup
                              alignText={Alignment.LEFT}
                              className="bp3-minimal bp3-vertical bp3-fill"
                            >
                              <Button
                                className="outline-0 bp3-large bp3-popover-dismiss bp3-minimal"
                                style={{ color: 'red' }}
                                onClick={async () => {
                                  await props.changeProjectMemberRole(
                                    { role: 'projectModerator' },
                                    member._id,
                                    member.account._id,
                                  );
                                }}
                              >
                                <span>Remove from Admin</span>
                              </Button>
                            </ButtonGroup>
                          }
                          target={
                            <Icon
                              className=" pointer"
                              icon="drag-handle-vertical"
                            />
                          }
                        />
                      ) : null}
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                  <td colSpan={5}>No admins</td>
                </tr>
              )}
          </tbody>
        </HTMLTable>
        {/* Admins list ends */}

        {/* Project Moderators list starts */}
        <h1 className="f4 mt4">Project Moderators</h1>
        <HTMLTable className="w-100 mv3" striped={true}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Division</th>
              <th>Department</th>
              <th>Position</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {moderatorList.length ? (
              moderatorList.map(({ _id, member }) => (
                <tr key={_id}>
                  <td style={{ width: '24%' }}>
                    {member.account.name}
                  </td>
                  <td style={{ width: '24%' }}>
                    {member.designations.length
                      ? getDivisionName[
                      member.designations[0].division
                      ]
                      : null}
                  </td>
                  <td style={{ width: '24%' }}>
                    {showDepartment(member)}
                  </td>
                  <td style={{ width: '24%' }}>
                    {member.designations.length
                      ? member.designations[0].position
                      : null}
                  </td>
                  <td style={{ width: '4%' }}>
                    {isEqual(props.companyRole, 'superAdmin') ||
                      (!isEmpty(props.projectRole) &&
                        isEqual(props.projectRole, 'admin')) ? (
                        <Popover
                          className="fr"
                          position={Position.BOTTOM}
                          popoverClassName="bp3-popover-content-sizing bg-white"
                          content={
                            <ButtonGroup
                              alignText={Alignment.LEFT}
                              className="bp3-minimal bp3-vertical bp3-fill"
                            >
                              <Button
                                className="outline-0 bp3-large bp3-popover-dismiss bp3-minimal"
                                onClick={async () => {
                                  await props.changeProjectMemberRole(
                                    { role: 'admin' },
                                    member._id,
                                    member.account._id,
                                  );
                                }}
                              >
                                <span>Make Admin</span>
                              </Button>
                              <Button
                                className="outline-0 bp3-large bp3-popover-dismiss bp3-minimal"
                                style={{ color: 'red' }}
                                onClick={async () => {
                                  await props.changeProjectMemberRole(
                                    { role: 'member' },
                                    member._id,
                                    member.account._id,
                                  );
                                }}
                              >
                                <span>Remove from Moderator</span>
                              </Button>
                            </ButtonGroup>
                          }
                          target={
                            <Icon
                              className=" pointer"
                              icon="drag-handle-vertical"
                            />
                          }
                        />
                      ) : null}
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                  <td colSpan={5}>No Moderators</td>
                </tr>
              )}
          </tbody>
        </HTMLTable>
        {/* Project Moderators list ends */}

        {/* Project Teammates list starts */}
        <div className="flex items-center justify-between mt4">
          <h1 className="f4">Project Teammates</h1>
        </div>
        <HTMLTable className="w-100 mv3" striped={true}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Division</th>
              <th>Department</th>
              <th>Position</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {teamList.length ? (
              teamList.map(({ _id, member }) => (
                <tr key={_id}>
                  <td style={{ width: '24%' }}>
                    {member.account.name}
                  </td>
                  <td style={{ width: '24%' }}>
                    {member.designations.length
                      ? getDivisionName[
                      member.designations[0].division
                      ]
                      : null}
                  </td>
                  <td style={{ width: '24%' }}>
                    {showDepartment(member)}
                  </td>
                  <td style={{ width: '24%' }}>
                    {member.designations.length
                      ? member.designations[0].position
                      : null}
                  </td>
                  <td style={{ width: '4%' }}>
                    {isEqual(props.companyRole, 'superAdmin') ||
                      (!isEmpty(props.projectRole) &&
                        isEqual(props.projectRole, 'admin')) ? (
                        <Popover
                          className="fr"
                          position={Position.BOTTOM}
                          popoverClassName="bp3-popover-content-sizing bg-white"
                          content={
                            <ButtonGroup
                              alignText={Alignment.LEFT}
                              className="bp3-minimal bp3-vertical bp3-fill"
                            >
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 750029e8... Release/v2.2.0 (#183)
                              <span>Make Moderator</span>
                            </Button>
                          </ButtonGroup>
                        }
                        target={
                          <Icon
                            className=" pointer"
                            icon="drag-handle-vertical"
                          />
                        }
                      />
                    ) : null}
<<<<<<< HEAD
=======
=======
>>>>>>> 2650e2be... Feature/mobile responsive (#148)
                              <Button
                                className="outline-0 bp3-large bp3-popover-dismiss bp3-minimal"
                                onClick={async () => {
                                  await props.changeProjectMemberRole(
                                    { role: 'projectModerator' },
                                    member._id,
                                    member.account._id,
                                  );
                                }}
                              >
                                <span>Make Moderator</span>
                              </Button>
                            </ButtonGroup>
                          }
                          target={
                            <Icon
                              className=" pointer"
                              icon="drag-handle-vertical"
                            />
                          }
                        />
                      ) : null}
<<<<<<< HEAD
>>>>>>> a51ad486... Feature/mobile responsive (#148)
=======
>>>>>>> 750029e8... Release/v2.2.0 (#183)
=======
>>>>>>> 2650e2be... Feature/mobile responsive (#148)
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                  <td colSpan={5}>No Teammates</td>
                </tr>
              )}
          </tbody>
        </HTMLTable>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        <h1 className="f4 mv4">Project Associates</h1>
=======
>>>>>>> c885f026... add associates in the project (#19)
=======
        <h1 className="f4 mv4">Project Associates</h1>
>>>>>>> a51ad486... Feature/mobile responsive (#148)
=======
>>>>>>> f4601c6e... add associates in the project (#19)
=======
        <h1 className="f4 mv4">Project Associates</h1>
>>>>>>> 2650e2be... Feature/mobile responsive (#148)
        <AssociateList />
      </div>

      {showDialog && (
        <Dialog
          onClose={() => setShowDialog(!showDialog)}
          isOpen={showDialog}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <AddProjectMemberForm
            showDialog={showDialog}
            setShowDialog={(e) => setShowDialog(!showDialog)}
          />
        </Dialog>
      )}

      {showAssociateDialog && (
        <Dialog
          onClose={() => setShowAssociateDialog(!showAssociateDialog)}
          isOpen={showAssociateDialog}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <AddProjectAssociateForm
            showDialog={showAssociateDialog}
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
            setShowDialog={(e) =>
              setShowAssociateDialog(!showAssociateDialog)
            }
=======
            setShowDialog={(e) => setShowAssociateDialog(!showAssociateDialog)}
>>>>>>> c885f026... add associates in the project (#19)
=======
            setShowDialog={(e) =>
              setShowAssociateDialog(!showAssociateDialog)
            }
>>>>>>> d06346b0... code style issue fixed
=======
            setShowDialog={(e) => setShowAssociateDialog(!showAssociateDialog)}
>>>>>>> f4601c6e... add associates in the project (#19)
=======
            setShowDialog={(e) =>
              setShowAssociateDialog(!showAssociateDialog)
            }
>>>>>>> 4e99f05f... code style issue fixed
          />
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    teams: state.projectReducer.teams,
    associates: state.projectReducer.associates,
    projectRole:
      state.projectReducer.projectRole.projects &&
      state.projectReducer.projectRole.projects.role,
    companyRole: state.companyReducer.currentCompany.role,
    project: state.projectReducer.projectDetails,
    company: state.companyReducer.currentCompany,
<<<<<<< HEAD
    projectList: state.projectReducer.allProjects,
=======
>>>>>>> a51ad486... Feature/mobile responsive (#148)
  };
};

export const ProjectTeamPage = connect(mapStateToProps, {
  getProjectTeams,
  changeProjectMemberRole,
})(ProjectTeamPageComponent);
