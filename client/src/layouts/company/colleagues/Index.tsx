import React, { useState, useEffect } from 'react';
import {
  Button,
  HTMLTable,
  Dialog,
  Popover,
  Position,
  Icon,
  ButtonGroup,
  Alignment,
} from '@blueprintjs/core';
import { AddColleaguesForm } from 'layouts/company/colleagues/AddColleaguesForm';
import { connect } from 'react-redux';
import {
  getCompanyMembers,
  getAllDepartments,
  addDesignation,
  editDesignation,
  changeMemberRole,
  getCompanyPendingMembers,
  deleteCompanyMember,
  inviteColleagueInBulk,
} from 'stores/company/Actions';
import {
  ICompanyMembers,
  ICompanyPendingMembers,
  ICompany,
} from 'stores/company/Reducer';
import { Loading } from 'components/Loading';
import { companyPermit } from 'stores/UtilsActions';
import { AddDesignationForm } from 'layouts/company/colleagues/AddDesignationForm';
import { EditDesignationForm } from 'layouts/company/colleagues/EditDesignationForm';
import { isEqual, upperFirst, chunk } from 'lodash';
import { User } from 'stores/user/Reducer';
import { IProjectTeam } from 'stores/project/Reducer';
import { isMobileOnly } from 'react-device-detect';
import { NavbarCompany } from 'components/NavbarCompany';
import { InviteColleagueView } from './InviteColleagueView';
import { inviteColleagueInBulkSuccess } from '../../../stores/company/Actions';

interface Colleagues {
  company: ICompany;
  user: User;
  getCompanyMembers: () => void;
  getCompanyPendingMembers: (limit?: number, skip?: number) => void;
  getAllDepartments: () => void;
  addDesignation: (values: any, memberId: string) => void;
  editDesignation: (values: any, memberId: string) => void;
  changeMemberRole: (
    values: { role: string },
    memberId: string,
  ) => void;
  deleteCompanyMember: (memberId: string) => void;
  inviteColleagueInBulk: (emails: any) => void;
  companyLoading: boolean;
  inviteColleagueInBulkSuccess: () => void;
  subscriptiontExpired: boolean;
}

const load = async (
  _getCompanyMembers: () => void,
  _getCompanyPendingMembers: (limit?: number, skip?: number) => void,
) => {
  await _getCompanyMembers();
  await _getCompanyPendingMembers();
};

const divisions = [
  { _id: 'director', name: 'Director' },
  { _id: 'cxo', name: 'CXO' },
  { _id: 'seniorManager', name: 'Senior Manager' },
  { _id: 'middleManager', name: 'Middle Manager' },
  { _id: 'operationalEmployee', name: 'Operational Employee' },
];

export const getDivisionName = {
  director: 'Director',
  cxo: 'CXO',
  seniorManager: 'Senior Manager',
  middleManager: 'Middle Manager',
  operationalEmployee: 'Operational Employee',
};

export const showDepartment = (
  member: ICompanyMembers | IProjectTeam['member'],
) => {
  if (
    member.designations.length &&
    ['director', 'cxo'].includes(member.designations[0].division) ===
      false
  ) {
    // show department
    if (
      member.designations[0].department &&
      member.designations[0].department.name
    ) {
      return member.designations[0].department.name;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

const ColleaguesPageComponent = (props: Colleagues) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showDialogAdd, setShowDialogAdd] = useState(false);
  const [showDialogEdit, setShowDialogEdit] = useState(false);
  const [
    showDialogForInviteColleague,
    setshowDialogForInviteColleague,
  ] = useState(false);
  const [editMember, setEditMember] = useState<
    ICompanyMembers | undefined
  >(undefined);
  const [membersList, setMembersList] = useState<ICompanyMembers[]>(
    [],
  );
  const [adminsList, setAdminsList] = useState<ICompanyMembers[]>([]);
  const [pendingList, setPendingList] = useState<
    ICompanyPendingMembers[][]
  >([]);

  const setInviteDialogue = () => {
    setshowDialogForInviteColleague(!showDialogForInviteColleague);
  };

  useEffect(() => {
    load(props.getCompanyMembers, props.getCompanyPendingMembers);
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

  useEffect(() => {
    if (
      props.company &&
      props.company.members &&
      props.company.members.length
    ) {
      const a: ICompanyMembers[] = [];
      const b: ICompanyMembers[] = [];
      props.company.members.forEach((m) => {
        if (companyPermit(m.role)) {
          a.push(m);
        } else {
          b.push(m);
        }
      });
      setAdminsList(a);
      setMembersList(b);
    }
  }, [props.company.members]);

  useEffect(() => {
    if (
      props.company &&
      props.company.pendingMembers &&
      props.company.pendingMembers.length
    ) {
      setPendingList(chunk(props.company.pendingMembers, 4));
    }
  }, [props.company.pendingMembers]);

  return (
    <>
      <NavbarCompany title="My Colleagues" />
      <div className="ph5-ns ph3 pb5 pt5 pt0-ns">
        <div className="flex justify-between items-center">
          {isMobileOnly ? undefined : (
            <h1 className="tigrow-lightGray-1">Colleagues</h1>
          )}
          {companyPermit(props.company.role) ? (
            <div>
              <Button
                className="grow fr h2 pointer white bp3-minimal "
                style={{
                  background: '#3F61C5',
                  outline: 'none',
                  color: 'white',
                }}
                onClick={() => setShowDialog(!showDialog)}
              >
                Add Colleagues
              </Button>
              <Button
                className="grow fr h2 pointer white bp3-minimal mr2"
                style={{
                  background: '#3F61C5',
                  outline: 'none',
                  color: 'white',
                }}
                onClick={() =>
                  setshowDialogForInviteColleague(
                    !showDialogForInviteColleague,
                  )
                }
              >
                Invite Colleagues
              </Button>
            </div>
          ) : undefined}
        </div>

        {/* Admins list starts */}
        <h1 className="f4 mb0 tigrow-lightGray-1">Admins</h1>
        <HTMLTable className="w-100 mv3" striped={true}>
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Name</th>
              <th style={{ width: '20%' }}>Email</th>
              {/* <th style={{ width: '20%' }}>Contact No</th> */}
              <th style={{ width: '20%' }}>Division</th>
              <th style={{ width: '20%' }}>Department</th>
              <th style={{ width: '20%' }}>Position</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {props.companyLoading ? (
              <Loading />
            ) : adminsList.length ? (
              // tslint:disable-next-line: no-shadowed-variable
              adminsList.map((member) => (
                <tr className="hide-child" key={member._id}>
                  <td className="flex items-center">
                    <span className="mr2-ns mr1 f7 f6-ns">
                      <td
                        style={{
                          width: '24%',
                          boxShadow: 'none',
                          background: 'inherit',
                          padding: '0',
                        }}
                      >
                        {member.account &&
                          `${upperFirst(
                            member.account.firstName,
                          )} ${upperFirst(member.account.lastName)}`}
                      </td>
                    </span>
                    {companyPermit(member.role) ? (
                      member.role === 'superAdmin' ? (
                        <Icon
                          icon="star"
                          iconSize={15}
                          style={{ color: 'rgb(228, 162, 0)' }}
                        />
                      ) : (
                        <Icon icon="star" iconSize={15} />
                      )
                    ) : null}
                  </td>
                  <td>
                    <span className="mr2-ns mr1 f7 f6-ns">
                      {member.account ? member.account.email : null}
                    </span>
                  </td>
                  <td>
                    {/* <span className="mr2-ns mr1 f7 f6-ns">
                      {member.account ? member.account.contactNo : null}
                    </span> */}
                  </td>
                  <td className="f7 f6-ns">
                    {member.designations.length
                      ? getDivisionName[
                          member.designations[0].division
                        ]
                      : null}
                  </td>
                  <td>
                    <small className="f7 f6-ns">
                      {showDepartment(member)}
                    </small>
                  </td>
                  <td>
                    {member.designations.length ? (
                      <small className="f7 f6-ns">
                        {member.designations[0].position}
                      </small>
                    ) : null}
                  </td>
                  {/* Popover starts */}
                  <td>
                    {companyPermit(props.company.role) ||
                    isEqual(member.account._id, props.user._id) ? (
                      <Popover
                        className="fr"
                        position={Position.BOTTOM}
                        popoverClassName="bp3-popover-content-sizing bg-white"
                        content={
                          <ButtonGroup
                            alignText={Alignment.LEFT}
                            className="bp3-minimal bp3-vertical bp3-fill"
                          >
                            {member.designations &&
                            member.designations.length ? (
                              <Button
                                className="outline-0 bp3-large bp3-popover-dismiss"
                                onClick={async () => {
                                  setEditMember(member);
                                  await props.getAllDepartments();
                                  setShowDialogEdit(!showDialogEdit);
                                }}
                              >
                                <span>Edit Designation</span>
                              </Button>
                            ) : (
                              <Button
                                className="outline-0 bp3-large bp3-popover-dismiss"
                                onClick={async () => {
                                  setEditMember(member);
                                  await props.getAllDepartments();
                                  setShowDialogAdd(!showDialogAdd);
                                }}
                              >
                                <span>Add Designation</span>
                              </Button>
                            )}
                            {companyPermit(props.company.role) &&
                            isEqual(member.role, 'superAdmin') ===
                              false
                              ? isEqual(member.role, 'admin') === true
                                ? props.company.role ===
                                    'superAdmin' && (
                                    <Button
                                      className="outline-0 bp3-large bp3-popover-dismiss"
                                      onClick={async () => {
                                        await props.changeMemberRole(
                                          { role: 'employee' },
                                          member._id,
                                        );
                                      }}
                                    >
                                      <span className="red">
                                        Remove from Admin
                                      </span>
                                    </Button>
                                  )
                                : props.company.role ===
                                    'superAdmin' && (
                                    <Button
                                      className="outline-0 bp3-large bp3-popover-dismiss"
                                      onClick={async () => {
                                        await props.changeMemberRole(
                                          { role: 'admin' },
                                          member._id,
                                        );
                                      }}
                                    >
                                      <span>Make Admin</span>
                                    </Button>
                                  )
                              : null}
                          </ButtonGroup>
                        }
                        target={
                          <Icon
                            className=" pointer"
                            icon="drag-handle-vertical"
                          />
                        }
                      />
                    ) : undefined}
                    {/* Popover ends */}
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
        {/* members list starts */}
        <h1 className="f4 mb0 tigrow-lightGray-1">Members</h1>
        <HTMLTable className="w-100 mv3" striped={true}>
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Name</th>
              <th style={{ width: '20%' }}>Email</th>
              {/* <th style={{ width: '20%' }}>Contact No</th> */}
              <th style={{ width: '20%' }}>Division</th>
              <th style={{ width: '20%' }}>Department</th>
              <th style={{ width: '20%' }}>Position</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {props.companyLoading ? (
              <Loading />
            ) : membersList.length ? (
              // tslint:disable-next-line: no-shadowed-variable
              membersList.map((member) => (
                // TODO Separate this <tr> into a component
                <tr className="hide-child" key={member._id}>
                  <td>
                    <span className="mr2-ns mr1 f7 f6-ns">
                      {member.account &&
                        `${upperFirst(
                          member.account.firstName,
                        )} ${upperFirst(member.account.lastName)}`}
                    </span>
                    {companyPermit(member.role) ? (
                      member.role === 'superAdmin' ? (
                        <Icon
                          icon="star"
                          iconSize={15}
                          style={{ color: 'rgb(228, 162, 0)' }}
                        />
                      ) : (
                        <Icon iconSize={15} icon="star" />
                      )
                    ) : null}
                  </td>
                  <td>
                    <span className="mr2-ns mr1 f7 f6-ns">
                      {member.account ? member.account.email : null}
                    </span>
                  </td>
                  <td className="f7 f6-ns">
                    {member.designations.length
                      ? getDivisionName[
                          member.designations[0].division
                        ]
                      : null}
                  </td>
                  <td>
                    <small className="f7 f6-ns">
                      {showDepartment(member)}
                    </small>
                  </td>
                  <td>
                    {member.designations.length ? (
                      <small className="f6-ns f7">
                        {member.designations[0].position}
                      </small>
                    ) : null}
                  </td>
                  {/* Popover starts */}
                  <td>
                    {companyPermit(props.company.role) ||
                    isEqual(member.account._id, props.user._id) ? (
                      <Popover
                        className="fr"
                        position={Position.BOTTOM}
                        popoverClassName="bp3-popover-content-sizing bg-white"
                        content={
                          <ButtonGroup
                            alignText={Alignment.LEFT}
                            className="bp3-minimal bp3-vertical bp3-fill"
                          >
                            {member.designations &&
                            member.designations.length ? (
                              <Button
                                className="outline-0 bp3-large bp3-popover-dismiss"
                                onClick={async () => {
                                  setEditMember(member);
                                  await props.getAllDepartments();
                                  setShowDialogEdit(!showDialogEdit);
                                }}
                              >
                                <span>Edit Designation</span>
                              </Button>
                            ) : (
                              <Button
                                className="outline-0 bp3-large bp3-popover-dismiss"
                                onClick={async () => {
                                  setEditMember(member);
                                  await props.getAllDepartments();
                                  setShowDialogAdd(!showDialogAdd);
                                }}
                              >
                                <span>Add Designation</span>
                              </Button>
                            )}
                            {companyPermit(props.company.role) &&
                            isEqual(member.role, 'superAdmin') ===
                              false
                              ? isEqual(member.role, 'admin') === true
                                ? props.company.role ===
                                    'superAdmin' && (
                                    <Button
                                      className="outline-0 bp3-large bp3-popover-dismiss"
                                      onClick={async () => {
                                        await props.changeMemberRole(
                                          { role: 'employee' },
                                          member._id,
                                        );
                                      }}
                                    >
                                      <span className="red">
                                        Remove from Admin
                                      </span>
                                    </Button>
                                  )
                                : props.company.role ===
                                    'superAdmin' && (
                                    <Button
                                      className="outline-0 bp3-large bp3-popover-dismiss"
                                      onClick={async () => {
                                        await props.changeMemberRole(
                                          { role: 'admin' },
                                          member._id,
                                        );
                                      }}
                                    >
                                      <span>Make Admin</span>
                                    </Button>
                                  )
                              : null}
                            {/* {companyPermit(props.company.role) ? (
                                <Button
                                  className='outline-0 bp3-large bp3-popover-dismiss'
                                  onClick={async () => {
                                    await props.changeMemberRole(
                                      { role: 'employee' },
                                      member._id
                                    );
                                  }}
                                >
                                  <span className='red'>Remove from Admin</span>
                                </Button>
                              ) : null} */}
                          </ButtonGroup>
                        }
                        target={
                          <Icon
                            className=" pointer"
                            icon="drag-handle-vertical"
                          />
                        }
                      />
                    ) : undefined}
                    {/* Popover ends */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No members</td>
              </tr>
            )}
          </tbody>
        </HTMLTable>
        {/* members list ends */}
        {/* pending list starts */}
        {companyPermit(props.company.role) ? (
          <>
            <h1 className="f4 tigrow-lightGray-1">
              Invited Colleagues
            </h1>
            <HTMLTable className="w-100 mv3" striped={true}>
              {props.companyLoading ? (
                <Loading />
              ) : pendingList.length ? (
                // tslint:disable-next-line: no-shadowed-variable
                pendingList.map((chunkMembers, i1) => (
                  <tbody>
                    {chunkMembers.map((member) => (
                      <tr className="hide-child" key={i1}>
                        <td>
                          <span className="mr2 f7 f6-ns">
                            {member.email}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ))
              ) : (
                <tbody>
                  <tr>
                    <td colSpan={3}>No pending request</td>
                  </tr>
                </tbody>
              )}
            </HTMLTable>
          </>
        ) : undefined}
        {/* pending list ends */}
      </div>

      {showDialog && (
        <Dialog
          onClose={() => setShowDialog(!showDialog)}
          isOpen={showDialog}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
          className="ma2"
        >
          <AddColleaguesForm
            showDialog={showDialog}
            setShowDialog={(e) => setShowDialog(!showDialog)}
          />
        </Dialog>
      )}
      {showDialogForInviteColleague && (
        <Dialog
          onClose={() =>
            setshowDialogForInviteColleague(
              !showDialogForInviteColleague,
            )
          }
          isOpen={showDialogForInviteColleague}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
          className="ma2"
        >
          <InviteColleagueView
            colleagueInviteSuccess={
              props.inviteColleagueInBulkSuccess
            }
            inviteColleagueInBulk={props.inviteColleagueInBulk}
            setshowDialogForInviteColleague={setInviteDialogue}
            currentCompany={props.company.name}
          />
        </Dialog>
      )}
      {showDialogAdd && (
        <Dialog
          onClose={() => setShowDialogAdd(!showDialogAdd)}
          isOpen={showDialogAdd}
          style={{ background: '#fff' }}
          className="ma2"
        >
          <AddDesignationForm
            addDesignation={props.addDesignation}
            getCompanyMembers={props.getCompanyMembers}
            member={editMember}
            divisions={divisions}
            departments={props.company.departments}
            setShowDialogAdd={(e) => setShowDialogAdd(!showDialogAdd)}
          />
        </Dialog>
      )}
      {showDialogEdit && (
        <Dialog
          onClose={() => setShowDialogEdit(!showDialogEdit)}
          isOpen={showDialogEdit}
          style={{ background: '#fff' }}
          className="ma2"
        >
          <EditDesignationForm
            editDesignation={props.editDesignation}
            getCompanyMembers={props.getCompanyMembers}
            member={editMember}
            divisions={divisions}
            departments={props.company.departments}
            setShowDialogEdit={(e) =>
              setShowDialogEdit(!showDialogEdit)
            }
          />
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany,
    companyLoading: state.companyReducer.loading,
    user: state.userReducer.user,
    subscriptiontExpired:
      state.subscriptionReducer.subscriptionExpired,
  };
};

export const ColleaguesPage = connect(mapStateToProps, {
  getCompanyMembers,
  getAllDepartments,
  addDesignation,
  editDesignation,
  changeMemberRole,
  getCompanyPendingMembers,
  deleteCompanyMember,
  inviteColleagueInBulk,
  inviteColleagueInBulkSuccess,
})(ColleaguesPageComponent);
