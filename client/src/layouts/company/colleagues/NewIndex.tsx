import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { isMobileOnly } from 'react-device-detect';
import { upperFirst } from 'lodash';

import Snackbar from '@material-ui/core/Snackbar/Snackbar';
import { Dialog } from '@blueprintjs/core/lib/esm/components/dialog/dialog';
import MuiAlert from '@material-ui/lab/Alert';

import {
  ICompanyMembers,
  ICompany,
  ICompanyAllMembers,
} from 'stores/company/Reducer';
import { User } from 'stores/user/Reducer';
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

import Navbar from 'components/navbar/Navbar';
import { InviteColleagueView } from './InviteColleagueView';
import { AddColleaguesForm } from 'layouts/company/colleagues/AddColleaguesForm';

import './Index.scss';
import CompanyColleagues from './CompanyColleagues';
import { SimpleButton } from 'components/announcement/AnnouncementDialog.styles';

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

export const getDivisionName = {
  director: 'Director',
  cxo: 'CXO',
  seniorManager: 'Senior Manager',
  middleManager: 'Middle Manager',
  operationalEmployee: 'Operational Employee',
};

export const showDepartment = (member: ICompanyMembers) => {
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
  const [
    showDialogForInviteColleague,
    setshowDialogForInviteColleague,
  ] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [allMembers, setAllMembers] = useState<ICompanyAllMembers>({
    acceptedMembers: [],
    pendingMembers: [],
    invitedMembers: [],
  });
  const [colleaguesList, setColleaguesList] = useState<any[]>([]);

  useEffect(() => {
    if (props.company._id) {
      props.getCompanyMembers();
      props.getCompanyPendingMembers();
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
      props.company.allMembers &&
      props.company.allMembers.acceptedMembers?.length
    ) {
      setAllMembers(props.company.allMembers);
    }
  }, [props.company.allMembers]);

  const handleMembers = (m, type) => {
    return {
      id: m._id,
      name: `${upperFirst(
        m.account?.firstName || '',
      )}${' '}${upperFirst(m.account?.lastName || '')}`,
      accountId: m.account?._id || '',
      profileImage: m.account?.profileImage
        ? m.account.profileImage
        : null,
      email: m.account?.email,
      division: `${
        m.designations?.length > 0 &&
        getDivisionName[m.designations[0].division]
      }`,
      position: `${
        m.designations?.length > 0 && m.designations[0].position
      }`,
      role: m.role,
      designations: m?.designations,
      m: m,
      type,
    };
  };

  useEffect(() => {
    let allColleagues = [
      ...allMembers.acceptedMembers.map((m: any, i) =>
        handleMembers(m, 'joined'),
      ),
      ...allMembers.invitedMembers.map((m: any, i) =>
        handleMembers(m, 'pending'),
      ),
      ...allMembers.pendingMembers.map((m: any, i) => {
        return {
          id: m._id,
          name: '',
          accountId: '',
          profileImage: null,
          email: m.email,
          division: '',
          position: '',
          role: '',
          designations: '',
          m: m,
          type: 'invited',
        };
      }),
    ];
    setColleaguesList(allColleagues);
  }, [allMembers]);

  return (
    <>
      {isMobileOnly && <Navbar type="company" />}
      <div className="flex justify-end">
        <SimpleButton
          className="mr3"
          onClick={() => setShowDialog(true)}
        >
          Add Colleagues
        </SimpleButton>
        <SimpleButton
          onClick={() => setshowDialogForInviteColleague(true)}
        >
          Invite Colleagues
        </SimpleButton>
      </div>
      <div style={{ minHeight: '100%' }}>
        {colleaguesList.length ? (
          <CompanyColleagues colleagues={colleaguesList} />
        ) : null}
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

export const NewColleaguesPage = connect(mapStateToProps, {
  getCompanyMembers,
  getAllDepartments,
  addDesignation,
  editDesignation,
  changeMemberRole,
  getCompanyPendingMembers,
  deleteCompanyMember,
  inviteColleagueInBulk,
})(ColleaguesPageComponent);

export default NewColleaguesPage;
