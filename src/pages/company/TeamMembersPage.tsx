import React, { useState, useEffect } from 'react';
import { Button, HTMLTable, Dialog } from '@blueprintjs/core';
import { AddMemberForm } from 'components/company/team/AddMemberForm';
import { connect } from 'react-redux';
import { getCompanyMembers } from 'stores/company/Actions';
import { CompanyModel } from 'stores/company/Reducer';
import { Loading } from 'components/common/field/Loading';

interface TeamMember {
  company: CompanyModel;
  getCompanyMembers: () => void;
  companyLoading: boolean;
}

const loadCompanyMember = async (getCompanyMembers: () => void) => {
  await getCompanyMembers();
}

const TeamMembersPageComponent = (props: TeamMember) => {

  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    loadCompanyMember(props.getCompanyMembers);
  }, []);

  return (
    <>
      <div>
        <h1 className="f4 tigrow-lightGray-1 ml4 mb0 mt5">Team</h1>
        <div className="vh-50 cf bg-white mh4 mv3 br3 pa4 shadow-4 w-90">
          <div>
            <h1 className="f5 lh-title tigrow-lightGray-1 dib">Team Members</h1>
            <Button className="grow fr h2 pointer white bp3-minimal "
              style={{ background: "#0fa3a3", outline: "none", color: 'white' }}
              onClick={() => setShowDialog(!showDialog)}
            >
              Add Team Members
          </Button>
          </div>
          <HTMLTable
            className="w-100 mt4"
            striped={true}
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              {props.companyLoading ? <Loading /> : props.company && props.company.members && props.company.members.length > 0 ?
                props.company.members.map(member => (
                  <tr>
                    <td>{member.account.name}</td>
                    <td></td>
                    <td></td>
                  </tr>
                ))
                : <tr><td colSpan={3}>No members</td></tr>
              }


            </tbody>
          </HTMLTable>
        </div>
      </div>
      {showDialog && (
        <Dialog
          onClose={() => setShowDialog(!showDialog)}
          isOpen={showDialog}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <AddMemberForm
            showDialog={showDialog}
            setShowDialog={e => setShowDialog(!showDialog)}
          />
        </Dialog>
      )}
    </>
  )
}

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany,
    companyLoading: state.companyReducer.loading
  }
}

export const TeamMembersPage = connect(mapStateToProps, { getCompanyMembers })(TeamMembersPageComponent)