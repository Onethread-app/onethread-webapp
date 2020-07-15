import React, { useState, useEffect } from 'react';
import {
  SuggestField,
  ItemEntityProps,
} from 'components/fields/SuggestField';
import { connect, useDispatch } from 'react-redux';
import { tokenConfig } from 'stores/UtilsActions';
import { isEqual, isEmpty } from 'lodash';
import { Button, Tag } from '@blueprintjs/core';
import { addRoomMembers } from 'stores/room/Actions';
import { tigrowApi } from 'config';
import { IRoomReducer } from 'stores/room/Reducer';
import { room } from 'stores/room/Types';

interface RoomMembersViewProps {
  showDialog: boolean;
  setShowDialog: (val: boolean) => void;
  roomStatus: number;
}

interface RoomMembersViewInternalProps extends RoomMembersViewProps {
  // tslint:disable-next-line: max-line-length
  addRoomMembers: (
    members: {
      room: string;
      company: string;
      project: string;
      members: Array<{
        account: any;
        team: any;
      }>;
    },
    selectedRoomMember: ItemEntityProps[],
  ) => void;
  currentRoom: IRoomReducer['currentRoom'];
  companyId: string;
  projectId: string;
}

const AddMemberFormComponent = (
  props: RoomMembersViewInternalProps,
) => {
  const [suggestedMembers, setSuggestedMembers]: any = useState([]);
  const [selectedRoomMember, setSelectedRoomMember] = useState(
    [] as ItemEntityProps[],
  );
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const getSuggestionsForRoomMembers = async () => {
    try {
      const headers = tokenConfig();
      if ((headers as any).headers.Authorization) {
        // tslint:disable-next-line:max-line-length
        const response = await tigrowApi.get(
          `/rooms/suggest-member?pid=${props.projectId}&roomId=${props.currentRoom._id}`,
          headers,
        );
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

  const errorHandling: any = (status: number) => {
    
    setError('');
    if (status === 201) {
      props.setShowDialog(!props.showDialog);
    } else if (status === 400) {
      setError('Could not add more than 10 members at time');
    } else if (status === 0) {
      setError('');
    } else {
      setError('Network Error');
    }
    return;

  };

  useEffect(() => {
    if (
      isEmpty(props.currentRoom._id) === false &&
      isEmpty(props.companyId) === false
    ) {
      getSuggestionsForRoomMembers();
      errorHandling(props.roomStatus);
    }
  }, [props.roomStatus]);

  return (
    <div className="pa3">
      <div className="w-100">
        <h1 className="f5 tigrow-darkBlue">Add Members</h1>
        <SuggestField
          items={suggestedMembers}
          selectedItems={selectedRoomMember}
          setSelectedItems={setSelectedRoomMember}
          multipleItemSelect={true}
        />
        <small
          className={`${
            error || selectedRoomMember.length > 10 ? 'red' : 'black'
          }`}
        >
          {error
            ? error
            : selectedRoomMember.length > 10
            ? 'Could not add more than 10 members at a time'
            : 'Max user at a time : 10'}
        </small>
      </div>

      <div className="w-100 mb2">
        {selectedRoomMember.map((item) => (
          <Tag
            key={item._id}
            className="ma1 pa2"
            style={{ backgroundColor: '#3b5998', color: 'white' }}
            interactive={true}
            onRemove={(e) => {
              const filteredItems = selectedRoomMember.filter(
                (selectedItem) => item.name !== selectedItem.name,
              );
              setSelectedRoomMember([...filteredItems]);
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
          style={{
            background: '#fff',
            outline: 'none',
            border: '1px solid #3b5998',
            color: '#3b5998',
          }}
          onClick={(e: any) => {
            props.setShowDialog(!props.showDialog);
            dispatch({ type: room.CLEAR_STATUS_CODE });
          }}
        >
          Cancel
        </Button>
        <Button
          className="grow h2 pointer white bp3-minimal w4 outline-0"
          style={{ backgroundColor: '#3b5998', color: 'white' }}
          disabled={
            selectedRoomMember.length === 0 ||
            selectedRoomMember.length > 10
          }
          onClick={async () => {
            const data = {
              room: props.currentRoom._id,
              company: props.companyId,
              project: props.projectId,
              members: selectedRoomMember.map((m: any) => {
                return {
                  account: m._id,
                  team: m.teamId,
                };
              }),
            };
            await props.addRoomMembers(
              data,
              selectedRoomMember,
            );
            // if (props.roomStatus === 201) {
            //   props.setShowDialog(!props.showDialog);
            // } else if (props.roomStatus === 400) {
            //   setError('Could not add more than 10 members at time');
            // } else {
            //   setError('Network Error');
            // }
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentRoom: state.roomReducer.currentRoom,
    companyId: state.companyReducer.currentCompany._id,
    projectId: state.projectReducer.projectDetails._id,
    roomStatus: state.roomReducer.responseCode
  };
};

export const AddMemberForm = connect(mapStateToProps, {
  addRoomMembers,
})(AddMemberFormComponent);
