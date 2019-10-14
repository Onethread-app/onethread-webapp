import React, { useState } from 'react';
import { Button, HTMLTable, Dialog, Tag } from '@blueprintjs/core';
import { SuggestField, ItemEntityProps } from 'components/common/field/SuggestField';
import { isEmpty, isEqual } from 'lodash';
import tigrowApi from 'tigrowApi';
import { useStore, connect } from 'react-redux';
import { tokenConfig } from 'stores/UtilsActions';
import { addTeamMembers } from 'stores/company/Actions';
import { CompanyModel } from 'stores/company/Reducer';

interface CompanyTeamMembersViewInternalProps {
  company: CompanyModel;
  addTeamMembers: (userId: (string | undefined)[], name: string) => void;
}
const CompanyTeamMembersPageComponent = (props: CompanyTeamMembersViewInternalProps) => {
  const [teamMembers, setTeamMembers]: any = useState([]);

  const [showDialog, setShowDialog] = useState(false);
  // Should comes from redux store
  const [selectedItems, setSelectedItems] = useState([] as ItemEntityProps[]);
  const store = useStore();

  const showTeamMembers = async (userName: string) => {
    try {
      const headers = tokenConfig(store.getState);
      if ((headers as any).headers.Authorization) {
        const response = await tigrowApi.get(`account/search?username=${userName}`, headers);        
        setTeamMembers(response.data.employees.data);
      } else {
        console.log('no headers')
      }
    } catch (error) {
      if (isEqual(error.message, 'Network Error')) {
        console.log('network error')
      }
      else {
        console.log(error.response);
      }
    }
  }

  return (
    <>
      <div className="br3 bg-white h-auto pa4 mt3 cf w-100">
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
              <th>Position</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Nezam</td>
              <td>CSS framework and UI toolkit</td>
              <td>Sass, TypeScript, React</td>
            </tr>

          </tbody>
        </HTMLTable>
      </div>
      {showDialog && (
        <Dialog
          onClose={() => setShowDialog(!showDialog)}
          title="Add Members"
          isOpen={showDialog}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <div className="pa3">
            <div className=" w-100">
              <h1 className="f5">Add members</h1>
              <SuggestField
                onChange={(query: string) => { showTeamMembers(query) }}
                items={teamMembers}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              />
            </div>
            <div className="w-100 mb2">
              {selectedItems.map(item => (
                <Tag
                  key={item._id}
                  className="ma1 pa2"
                  interactive={true}
                  onRemove={e => {
                    const filteredItems = selectedItems.filter(selectedItem => (
                      item.name !== selectedItem.name
                    ));
                    setSelectedItems([
                      ...filteredItems
                    ])
                  }}
                  large={true}
                >
                  {item.name}
                </Tag>
              ))}
            </div>

            <div className="flex justify-end">
              <Button className="grow h2 pointer white bp3-minimal w4 mr3"
                style={{ background: "#fff", outline: "none", border: "1px solid #0fa3a3", color: "#0fa3a3" }}
                onClick={() => setShowDialog(!showDialog)}
              >
                Cancel
          </Button>
              <Button className="grow h2 pointer white bp3-minimal w4"
                style={{ background: "#0fa3a3", outline: "none", color: 'white' }}
                onClick={
                  () => {
                    if (!isEmpty(selectedItems)) {
                      const userId = selectedItems.map(selected => selected._id)
                      if (userId) {
                        props.addTeamMembers(userId, props.company.name);
                      }
                      setShowDialog(!showDialog)
                    }
                  }
                }
              >
                Add
          </Button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  )
}

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany
  }
}

export const CompanyTeamMembersPage = connect(mapStateToProps, { addTeamMembers })(CompanyTeamMembersPageComponent)