import React, { useState, useEffect } from 'react';
import {
  Button,
  HTMLTable,
  Popover,
  Position,
  Icon,
  HTMLSelect,
  Dialog,
  ButtonGroup,
  Alignment,
} from '@blueprintjs/core';
import { connect } from 'react-redux';
import { ICompany } from 'stores/company/Reducer';
import { User } from 'stores/user/Reducer';
import { AddProjectMemberForm } from './AddProjectMemberForm';
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

interface TeamMember {
  company: ICompany;
  user: User;
  teams: IProjectTeam[];
  companyRole: string;
  projectRole: string;
  getProjectTeams: () => void;
  changeProjectMemberRole: (
    values: { role: string },
    memberId: string,
    accountId: string,
  ) => void;
}

const load = async (_getProjectTeams: () => void) => {
  await _getProjectTeams();
};

const ProjectTeamPageComponent = (props: TeamMember) => {
  const [showDialog, setShowDialog] = useState(false);
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
      <div className="ph5">
        <div className="flex justify-between items-center">
          <h1 className="f3">Team Members</h1>
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

        {/* Associates list starts */}
        {/* <h1 className="f4 mt4">Representatives from Associates</h1>
        <h1 className="f5">AssociatesName1</h1>
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
            <tr>
              <td style={{ width: '24%' }}>labiba</td>
              <td style={{ width: '24%' }}>frontend</td>
              <td style={{ width: '24%' }}>frontend</td>
              <td style={{ width: '24%' }}>junior</td>
              <td style={{ width: '4%' }}>
                <Popover
                  className="fr"
                  position={Position.BOTTOM}
                  popoverClassName="bp3-popover-content-sizing bg-white"
                  content={
                    <Button
                      className="outline-0 bp3-large bp3-popover-dismiss bp3-minimal"
                      style={{ color: 'red' }}
                    ><span>Remove from Associates</span>
                    </Button>
                  }
                  target={
                    <Icon
                      className=" pointer"
                      icon="drag-handle-vertical"
                    />
                  }
                />
              </td>
            </tr>
          </tbody>
        </HTMLTable> */}
        {/* Associates list ends */}

        {/* Project Teammates list starts */}
        <div className="flex items-center justify-between mt4">
          <h1 className="f4">Project Teammates</h1>
          <div className="flex">
            <p className="pr3 fw7" style={{ marginTop: '.8rem' }}>
              Filter By
            </p>
            <div className="mt2" style={{ width: '200px' }}>
              <HTMLSelect
                fill={true}
                minimal={true}
                style={{
                  outline: 'none',
                  border: '1px solid #E1E1E1',
                  fontWeight: 600,
                  textAlignLast: 'center',
                }}
              >
                <option selected value="">
                  Department
                </option>
              </HTMLSelect>
            </div>
          </div>
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
                            {/* <Button
                              className="outline-0 bp3-large bp3-popover-dismiss bp3-minimal"
                              style={{ color: 'red' }}
                            ><span>Remove from Teammate</span>
                            </Button> */}
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
                <td colSpan={5}>No Teammates</td>
              </tr>
            )}
          </tbody>
        </HTMLTable>
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
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    teams: state.projectReducer.teams,
    projectRole:
      state.projectReducer.projectRole.projects &&
      state.projectReducer.projectRole.projects.role,
    companyRole: state.companyReducer.currentCompany.role,
  };
};

export const ProjectTeamPage = connect(mapStateToProps, {
  getProjectTeams,
  changeProjectMemberRole,
})(ProjectTeamPageComponent);
