import React, { useState, useEffect } from 'react';
import {
  Button,
  HTMLTable,
  Popover,
  Position,
  Icon,
  ButtonGroup,
  HTMLSelect,
  Dialog
} from '@blueprintjs/core';
import { connect } from 'react-redux';
import { ICompany } from 'stores/company/Reducer';
import { User } from 'stores/user/Reducer';
import { AddProjectMemberForm } from './AddProjectMemberForm';
import { RightSidebar } from 'components/RightSidebar';

interface TeamMember {
  company: ICompany;
  user: User;
  getCompanyMembers: () => void;
  getCompanyPendingMembers: (limit?: number, skip?: number) => void;
  getAllDepartments: () => void;
  addDesignation: (values: any, memberId: string) => void;
  editDesignation: (values: any, memberId: string) => void;
  changeMemberRole: (values: { role: string; }, memberId: string) => void;
  deleteCompanyMember: (memberId: string) => void;
  companyLoading: boolean;
}

const load = async (_getCompanyMembers: () => void) => {
  await _getCompanyMembers();
};

const ProjectTeamPageComponent = (props: TeamMember) => {
  const [showDialog, setShowDialog] = useState(false);
  const [adminsList, setAdminsList] = useState<any[]>([]);
  const [pendingList, setPendingList] = useState<any[]>([]);
  const [membersList, setMembersList] = useState<any[]>([]);

  // useEffect(() => {
  //   load(props.getCompanyMembers);
  // }, []);
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
              color: 'white'
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
                    ><span>Remove from Admin</span>
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
                    ><span>Remove from Project Moderator</span>
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
            <p className="pr3 fw7" style={{ marginTop: '.8rem' }}>Filter By</p>
            <div className="mt2" style={{ width: '200px' }}>
              <HTMLSelect
                fill={true}
                minimal={true}
                style={{
                  outline: 'none',
                  border: '1px solid #E1E1E1',
                  fontWeight: 600,
                  textAlignLast: 'center'
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
                    <ButtonGroup
                      vertical={true}
                      alignText="left"
                    >
                      <Button
                        className="outline-0 bp3-large bp3-popover-dismiss bp3-minimal"
                      ><span>Make Project Moderator</span>
                      </Button>
                      <Button
                        className="outline-0 bp3-large bp3-popover-dismiss bp3-minimal"
                        style={{ color: 'red' }}
                      ><span>Remove</span>
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
              </td>
            </tr>
          </tbody>
        </HTMLTable>
      </div>

      {
        showDialog && (
          <Dialog
            onClose={() => setShowDialog(!showDialog)}
            isOpen={showDialog}
            style={{ background: '#fff' }}
            canOutsideClickClose={false}
          >
            <AddProjectMemberForm
              showDialog={showDialog}
              setShowDialog={e => setShowDialog(!showDialog)}
            />
          </Dialog>
        )
      }
    </>
  );
};

export const ProjectTeamPage = connect(null, null)(ProjectTeamPageComponent);
