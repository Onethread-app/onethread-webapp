import React, { useState, useEffect } from 'react'
import { CompanyModel, ICompanyMembers } from 'stores/company/Reducer';
import { SuggestField, ItemEntityProps } from 'components/common/field/SuggestField';
import { useStore, connect, useSelector } from 'react-redux';
import { tokenConfig } from 'stores/UtilsActions';
import tigrowApi from 'tigrowApi';
import { isEqual } from 'lodash';
import { Button, Tag } from '@blueprintjs/core';
import { addTeamMembers } from 'stores/company/Actions';

interface RoomMembersViewProps {
  showDialog: boolean;
  setShowDialog: (val: boolean) => void;
}

interface RoomMembersViewInternalProps extends RoomMembersViewProps {
  company: CompanyModel;
  addTeamMembers: (members: { account: string | undefined, company: string }[], name: string) => void;
}


const AddMemberFormComponent = (props: RoomMembersViewInternalProps) => {

  const store = useStore();
  const [teamMembers, setTeamMembers]: any = useState([]);

  const [selectedTeamMember, setSelectedTeamMember] = useState([] as ItemEntityProps[]);

  const getSuggestionsForRoomMembers = async () => {
    try {
      const headers = tokenConfig(store.getState);
      if ((headers as any).headers.Authorization) {
        const response = await tigrowApi.get(`/rooms/members/${store.getState().roomReducer.roomId}/${store.getState().companyReducer.currentCompany._id}`, headers);
        console.log(response.data);
        setTeamMembers(response.data.members);
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

  const fetchTeamMembersByUsername = async (userName: string) => {
    console.log("Search: " + userName);
  }

  useEffect(() => {
    getSuggestionsForRoomMembers()
  }, []);

  return (
    <div className="pa3">
      <div className=" w-100">
        <h1 className="f5">Add members</h1>
        <SuggestField
          onChange={(query: string) => { fetchTeamMembersByUsername(query) }}
          items={teamMembers}
          selectedItems={selectedTeamMember}
          setSelectedItems={setSelectedTeamMember}
          multipleItemSelect={true}
        />
      </div>

      <div className="w-100 mb2">
        {selectedTeamMember.map(item => (
          <Tag
            key={item._id}
            className="ma1 pa2"
            interactive={true}
            onRemove={e => {
              const filteredItems = selectedTeamMember.filter(selectedItem => (
                item.name !== selectedItem.name
              ));
              setSelectedTeamMember([
                ...filteredItems
              ])
            }}
            large={true}
          >
            {item.name}
          </Tag>
        ))}
      </div>

      <div className="flex justify-end mt2">
        <Button className="grow h2 pointer white bp3-minimal w4 mr3"
          style={{ background: "#fff", outline: "none", border: "1px solid #0fa3a3", color: "#0fa3a3" }}
          onClick={(e: any) => props.setShowDialog(!props.showDialog)}
        >
          Cancel
          </Button>
        <Button className="grow h2 pointer white bp3-minimal w4"
          style={{ background: "#0fa3a3", outline: "none", color: 'white' }}
          onClick={async () => {

            props.setShowDialog(!props.showDialog);
          }
          }
        >
          Add
          </Button>
      </div>
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany
  }
}

export const AddMemberForm = connect(mapStateToProps, { addTeamMembers })(AddMemberFormComponent)
