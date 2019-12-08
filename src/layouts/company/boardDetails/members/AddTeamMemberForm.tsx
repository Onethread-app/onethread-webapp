import React, { useState } from 'react'
import { SuggestField, ItemEntityProps } from 'components/fields/SuggestField';
import { Tag, Button } from '@blueprintjs/core';
import { useStore, connect } from 'react-redux';
import { tokenConfig } from 'stores/UtilsActions';
import { isEmpty, isEqual } from 'lodash';
import tigrowApi from 'tigrowApi';
import { TaskBoard } from 'stores/board/Reducer';
import { CompanyModel } from 'stores/company/Reducer';
import { addTeamMembersIntoBoard } from 'stores/board/Actions';

interface AddTeamMemberFormProps {
  setShowAddMemberFormDialog?: (val: boolean) => void;
  currentBoard: TaskBoard;
}

interface AddTeamMemberFormInternalProps extends AddTeamMemberFormProps {
  company?: CompanyModel;
  addTeamMembersIntoBoard: (memberId: (string | undefined)[], name: string | undefined) => void;
}

const AddTeamMemberFormComponent = (props: AddTeamMemberFormInternalProps) => {

  const [teamMembers, setTeamMembers]: any = useState([]);
  const [loading, setLoading] = useState(false);
  // TODO Should comes from redux store
  const [selectedItems, setSelectedItems] = useState([] as ItemEntityProps[]);

  const store = useStore();

  const fetchTeamMembersByUsername = async (userName: string) => {
    try {
      const headers = tokenConfig(store.getState);
      if ((headers as any).headers.Authorization) {
        if (isEmpty(userName) === false) {
          const response = await tigrowApi.get(`/boards/${props.currentBoard._id}/suggest-member?companyId=${props.company!._id}`, headers);
          setTeamMembers(response.data.members);
        }
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
    <div className="pa3 bg-white cf">
      <div className="fl w-100 pv2">
        <SuggestField
          onChange={(query: string) => { fetchTeamMembersByUsername(query) }}
          items={teamMembers}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          multipleItemSelect={true}
        />
      </div>
      <div className="fl w-100 mb2">
        {selectedItems.map(item => (
          <Tag
            key={item._id}
            className="ma1 pa2"
            interactive={true}
            intent="primary"
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
      <div className="fl w-100">
        <div className="flex justify-end">
          <Button className="w4 grow h2 pointer mr3"
            onClick={(e: any) => {
              e.preventDefault();
              if (props.setShowAddMemberFormDialog) {
                props.setShowAddMemberFormDialog(false);
              }
            }}
            style={{ background: "#fff", outline: "none", border: "2px solid #0fa3a3", color: "#0fa3a3" }}
          >
            cancel
            </Button>
          <Button
            type="submit"
            onClick={async (e: any) => {
              e.preventDefault();
              setLoading(true);
              const userIds = selectedItems.map(selected => selected._id);
              if (userIds) {
                await props.addTeamMembersIntoBoard(userIds, props.currentBoard._id);
              }
              setLoading(false);
              if (props.setShowAddMemberFormDialog) {
                props.setShowAddMemberFormDialog(false);
              }
            }}
            className="w4 grow h2 pointer"
            loading={loading}
            style={selectedItems.length < 1 === false ?
              {
                background: "#0fa3a3",
                outline: "none",
                color: 'white'
              } : {
                background: '#011b1b2e',
                outline: "none",
                color: 'white'
              }
            }
            disabled={selectedItems.length < 1}
          >
            Add
            </Button>
        </div>
      </div>

    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany
  }
}

export const AddTeamMemberForm = connect(mapStateToProps, { addTeamMembersIntoBoard })(AddTeamMemberFormComponent)
