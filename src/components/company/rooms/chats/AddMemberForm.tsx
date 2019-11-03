import React, { useState, useEffect } from 'react'
import { SuggestField, ItemEntityProps } from 'components/common/field/SuggestField';
import { useStore, connect, useSelector } from 'react-redux';
import { tokenConfig } from 'stores/UtilsActions';
import tigrowApi from 'tigrowApi';
import { isEqual, isEmpty } from 'lodash';
import { Button, Tag } from '@blueprintjs/core';
import { addRoomMembers } from 'stores/room/Actions';

interface RoomMembersViewProps {
  showDialog: boolean;
  setShowDialog: (val: boolean) => void;
}

interface RoomMembersViewInternalProps extends RoomMembersViewProps {
  addRoomMembers: (members: any, selectedRoomMember: any) => void;
}


const AddMemberFormComponent = (props: RoomMembersViewInternalProps) => {

  const roomId = useSelector((state: any) => state.roomReducer.roomId);
  const companyId = useSelector((state: any) => state.companyReducer.currentCompany._id);

  const store = useStore();
  const [suggestedMembers, setSuggestedMembers]: any = useState([]);
  const [selectedRoomMember, setSelectedRoomMember] = useState([] as ItemEntityProps[]);

  const getSuggestionsForRoomMembers = async () => {
    try {
      const headers = tokenConfig(store.getState);
      if ((headers as any).headers.Authorization) {
        const response = await tigrowApi.get(`/rooms/suggest-member/${roomId}/${companyId}`, headers);
        setSuggestedMembers(response.data.members);
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

  useEffect(() => {
    if (isEmpty(roomId) === false && isEmpty(companyId) === false) {
      getSuggestionsForRoomMembers()
    }
  }, []);

  return (
    <div className="pa3">
      <div className=" w-100">
        <h1 className="f5">Add members</h1>
        <SuggestField
          items={suggestedMembers}
          selectedItems={selectedRoomMember}
          setSelectedItems={setSelectedRoomMember}
          multipleItemSelect={true}
        />
      </div>

      <div className="w-100 mb2">
        {selectedRoomMember.map(item => (
          <Tag
            key={item._id}
            className="ma1 pa2"
            interactive={true}
            onRemove={e => {
              const filteredItems = selectedRoomMember.filter(selectedItem => (
                item.name !== selectedItem.name
              ));
              setSelectedRoomMember([
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
            if (selectedRoomMember.length) {
              let members = {
                room: roomId,
                members: selectedRoomMember.map(m => m._id)
              }
              await props.addRoomMembers(members, selectedRoomMember);
            }
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

export const AddMemberForm = connect(null, { addRoomMembers })(AddMemberFormComponent)
