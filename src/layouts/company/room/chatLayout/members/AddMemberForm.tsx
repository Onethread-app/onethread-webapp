import React, { useState, useEffect } from 'react';
import { SuggestField, ItemEntityProps } from 'components/fields/SuggestField';
import { connect } from 'react-redux';
import { tokenConfig } from 'stores/UtilsActions';
import { isEqual, isEmpty } from 'lodash';
import { Button, Tag } from '@blueprintjs/core';
import { addRoomMembers } from 'stores/room/Actions';
import { tigrowApi } from 'config';

interface RoomMembersViewProps {
  showDialog: boolean;
  setShowDialog: (val: boolean) => void;
}

interface RoomMembersViewInternalProps extends RoomMembersViewProps {
  // tslint:disable-next-line: max-line-length
  addRoomMembers: (members: { room: string, members: Array<string | undefined> }, selectedRoomMember: ItemEntityProps[]) => void;
  roomId: string;
  companyId: string;
}

const AddMemberFormComponent = (props: RoomMembersViewInternalProps) => {

  // const store = useStore();
  const [suggestedMembers, setSuggestedMembers]: any = useState([]);
  const [selectedRoomMember, setSelectedRoomMember] = useState([] as ItemEntityProps[]);
  const [error, setError] = useState('');

  const getSuggestionsForRoomMembers = async () => {
    try {
      const headers = tokenConfig();
      if ((headers as any).headers.Authorization) {
        const response = await tigrowApi.get(`/rooms/suggest-member/${props.roomId}/${props.companyId}`, headers);
        setSuggestedMembers(response.data.members);
      } else {
        // tslint:disable-next-line: no-console
        console.log('no headers');
      }
    } catch (error) {
      if (isEqual(error.message, 'Network Error')) {
        // tslint:disable-next-line: no-console
        console.log('network error');
      } else {
        // tslint:disable-next-line: no-console
        console.log(error.response);
      }
    }
  };

  useEffect(() => {
    if (isEmpty(props.roomId) === false && isEmpty(props.companyId) === false) {
      getSuggestionsForRoomMembers();
    }
  }, []);

  useEffect(() => {
    if (selectedRoomMember.length > 10) {
      setError('Could not add more than 10 members at time');
    }
  }, [selectedRoomMember.length]);

  return (
    <div className="pa3">
      <div className=" w-100">
        <h1 className="f5 tigrow-lightBlue">Add members</h1>
        <SuggestField
          items={suggestedMembers}
          selectedItems={selectedRoomMember}
          setSelectedItems={setSelectedRoomMember}
          multipleItemSelect={true}
        />
        <small className={`${error || selectedRoomMember.length > 10 ? 'red' : 'white'}`}>
          {error ?
            error : selectedRoomMember.length > 10 ?
              'Could not add more than 10 members at a time' : 'Max user at a time : 10'}
        </small>
      </div>

      <div className="w-100 mb2">
        {selectedRoomMember.map((item) => (
          <Tag
            key={item._id}
            className="ma1 pa2"
            intent="primary"
            interactive={true}
            onRemove={(e) => {
              const filteredItems = selectedRoomMember.filter((selectedItem) => (
                item.name !== selectedItem.name
              ));
              setSelectedRoomMember([
                ...filteredItems
              ]);
            }}
            large={true}
          >
            {item.name}
          </Tag>
        ))}
      </div>

      <div className="flex justify-end mt3">
        <Button
          className="grow h2 pointer white bp3-minimal w4 mr3"
          style={{ background: '#fff', outline: 'none', border: '1px solid #0fa3a3', color: '#0fa3a3' }}
          onClick={(e: any) => props.setShowDialog(!props.showDialog)}
        >
          Cancel
        </Button>
        <Button className="grow h2 pointer white bp3-minimal w4"
          style={{ background: '#0fa3a3', outline: 'none', color: 'white' }}
          disabled={selectedRoomMember.length > 10}
          onClick={
            async () => {
              const data = {
                room: props.roomId,
                members: selectedRoomMember.map((m) => m._id)
              };
              const response: any = await props.addRoomMembers(data, selectedRoomMember);

              if (response.status === 201) {
                props.setShowDialog(!props.showDialog);
              } else if (response.status === 400) {
                setError('Could not add more than 10 members at time');
              } else {
                setError('Network Error');
              }
            }
          }
        >
          Add
          </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    roomId: state.roomReducer.roomId,
    companyId: state.companyReducer.currentCompany._id
  };
};

export const AddMemberForm = connect(mapStateToProps, { addRoomMembers })(AddMemberFormComponent);
