import React, { useState, useEffect } from 'react';
import { Button, HTMLTable, Dialog } from '@blueprintjs/core';
import MuiAlert from '@material-ui/lab/Alert';
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
import { upperFirst, chunk } from 'lodash';
import { User } from 'stores/user/Reducer';
import { IProjectTeam } from 'stores/project/Reducer';
import { isMobileOnly } from 'react-device-detect';
import Navbar from 'components/navbar/Navbar';
import { InviteColleagueView } from './InviteColleagueView';
import { useTranslation } from 'react-i18next';
import { Snackbar } from '@material-ui/core';
import MemberTable from '../../../components/MemberTable/MemberTable';
import SearchOption from 'components/SearchOption/SearchOption';
import './Index.scss';

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
  deleteCompanyMember: (accountId: string) => void;
  inviteColleagueInBulk: (emails: any) => void;
  companyLoading: boolean;
  subscriptiontExpired: boolean;
  invitingColleague: boolean;
  errorOnInvitingColleague: string;
}

const load = async (
  _getCompanyMembers: () => void,
  _getCompanyPendingMembers: (limit?: number, skip?: number) => void,
) => {
  await _getCompanyMembers();
  await _getCompanyPendingMembers();
};

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
  const { t } = useTranslation();
  const [showDialog, setShowDialog] = useState(false);
  const [
    showDialogForInviteColleague,
    setshowDialogForInviteColleague,
  ] = useState(false);
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [pendingList, setPendingList] = useState<
    ICompanyPendingMembers[][]
  >([]);

  const [members, setMembers] = React.useState<ICompanyMembers[]>([]);
  const [colleaguesList, setColleaguesList] = React.useState<any[]>(
    [],
  );

  const [rows, setRows] = React.useState<any[]>(colleaguesList);

  useEffect(() => {
    setRows(colleaguesList);
  }, [colleaguesList]);

  useEffect(() => {
    if (props.company._id) {
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
    }
  }, [props.company._id]);

  useEffect(() => {
    if (
      props.company &&
      props.company.members &&
      props.company.members.length
    ) {
      setMembers(props.company.members);
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
  }, [props.company]);

  useEffect(() => {
    let colleaguesList = members.map((m: any, i) => ({
      id: m._id,
      name: `${upperFirst(m.account.firstName)}${' '}${upperFirst(
        m.account.lastName,
      )}`,
      accountId: m.account._id,
      profileImage: m.account.profileImage
        ? m.account.profileImage
        : null,
      email: m.account.email,
      division: `${
        m.designations.length > 0 &&
        getDivisionName[m.designations[0].division]
      }`,
      position: `${
        m.designations.length > 0 && m.designations[0].position
      }`,
      role: m.role,
      designations: m.designations,
      m: m,
    }));
    setColleaguesList(colleaguesList);
  }, [members]);

  return (
    <>
      {isMobileOnly && <Navbar type="company" />}
      <div
        className="ph5-ns ph3 pb5 pt5 pt0-ns"
        style={{ background: '#E5E5E5', minHeight: '100%' }}
      >
        <div
          className="flex justify-between items-center mt2"
          style={{ borderBottom: '2px solid #E0E0E0' }}
        >
          {isMobileOnly ? undefined : (
            <h1 className="tigrow-lightGray-1">
              {t('app.company.Colleagues.Colleagues')} (
              {members.length})
            </h1>
            // <h1 className="tigrow-lightGray-1">Colleagues</h1>
          )}
          <div className="colleagues-top-area">
            <SearchOption
              list={colleaguesList}
              rows={rows}
              setRows={setRows}
            />
            {companyPermit(props.company.role) ? (
              <div>
                <Button
                  className="grow fr h2 pointer white bp3-minimal ml2 mb1"
                  style={{
                    background: '#08A0F7',
                    outline: 'none',
                    color: 'white',
                  }}
                  onClick={() => setShowDialog(!showDialog)}
                >
                  {t('app.company.Colleagues.Add-Colleagues')}
                  {/* Add Colleagues */}
                </Button>
                <Button
                  className="grow fr h2 pointer white bp3-minimal ml2 mb1"
                  style={{
                    background: '#08A0F7',
                    outline: 'none',
                    color: 'white',
                  }}
                  onClick={() =>
                    setshowDialogForInviteColleague(
                      !showDialogForInviteColleague,
                    )
                  }
                >
                  {t('app.company.Colleagues.Invite-Colleagues')}
                  {/* Invite Colleagues */}
                </Button>
              </div>
            ) : undefined}
          </div>
        </div>

        {colleaguesList.length && (
          <MemberTable
            type={'colleagues'}
            props={props}
            rows={rows}
          />
        )}

        {/* pending list starts */}
        {companyPermit(props.company.role) ? (
          <>
            <h1 className="f4 tigrow-lightGray-1">
              {t('app.company.Colleagues.Invited-Colleagues')}
              {/* Invited Colleagues */}
            </h1>
            <HTMLTable className="w-100 mv3" striped={true}>
              {props.companyLoading ? (
                <Loading />
              ) : pendingList.length ? (
                // tslint:disable-next-line: no-shadowed-variable
                pendingList.map((chunkMembers, i1) => (
                  <tbody className="bg-white">
                    {chunkMembers.map((member) => (
                      <tr className="hide-child" key={i1}>
                        <td
                          style={{
                            borderBottom: '1px solid #E8E8E8',
                          }}
                        >
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
                    <td colSpan={3}>
                      {t('app.company.Colleagues.No-pending')}
                    </td>
                    {/* <td colSpan={3}>No pending request</td> */}
                  </tr>
                </tbody>
              )}
            </HTMLTable>
          </>
        ) : undefined}
        {/* pending list ends */}
      </div>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MuiAlert severity="success">
          {props.errorOnInvitingColleague === ''
            ? `
            Invitation Successfully Sent To Join ${props.company.name}
            `
            : `${props.errorOnInvitingColleague}`}
        </MuiAlert>
      </Snackbar>
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
            inviteColleagueInBulk={props.inviteColleagueInBulk}
            setshowDialogForInviteColleague={
              setshowDialogForInviteColleague
            }
            currentCompany={props.company.name}
            setShowSnackbar={setShowSnackbar}
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
    invitingColleague: state.companyReducer.invitingColleague,
    errorOnInvitingColleague:
      state.companyReducer.errorOnInvitingColleague,
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
})(ColleaguesPageComponent);

export default ColleaguesPage;
