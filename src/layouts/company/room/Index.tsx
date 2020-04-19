import React, { useState, useEffect } from 'react';
import { Icon } from '@blueprintjs/core';
import { RoomSideBar } from 'layouts/company/room/leftSidebar/Index';
import { ChatLayout } from 'layouts/company/room/chatLayout/Index';
import { connect } from 'react-redux';
import { IRoomReducer, IRoom } from 'stores/room/Reducer';
import { isEmpty } from 'lodash';
import { RoomRightSidebar } from './rightSIdebar/Index';
import {
  getRoomMembers,
  getRoomMessages,
  getRooms,
  getRoomSharedFiles,
  getRoomDiscussions,
  getRoom,
} from 'stores/room/Actions';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { roomSubscribe } from './channelSubscribe';
import Pusher from 'pusher-js';

export interface RoomQueries {
  view: 'default' | 'mobile';
  roomId: string;
}

interface RoomPageComponentProps extends RouteComponentProps {
  currentRoom: IRoomReducer['currentRoom'];
  companyId: string;
  projectId: string;
  rooms: IRoom[];
  getRoom: (roomId: string) => void;
  getRooms: () => void;
  getRoomMembers: (roomId: string) => void;
  getRoomMessages: (roomId: string, limit?: number, skip?: number) => void;
  getRoomSharedFiles: (roomId: string, limit?: number, skip?: number) => void;
  getRoomDiscussions: (roomId: string, limit?: number, skip?: number) => void;
  pusherInstance: Pusher | undefined;
}

const RoomPageComponent = (props: RoomPageComponentProps) => {
  const [isOpenLeftSidebar, setIsOpenLeftSidebar] = useState(true);
  const [isOpenRightSidebar, setIsOpenRightSidebar] = useState(false);
  const [queries, setQueries] = useState<RoomQueries>({
    view: 'default',
    roomId: '',
  });

  const load = async (_getRooms: any) => {
    await _getRooms();
  };

  const roomSwitch = async (roomId: string) => {
    const status: any = await props.getRoom(roomId);
    if (status === 200) {
      await props.getRoomMessages(roomId);
      await props.getRoomMembers(roomId);
      await props.getRoomSharedFiles(roomId);
      await props.getRoomDiscussions(roomId);
      await roomSubscribe(roomId);
    }
  };

  // get all rooms
  useEffect(() => {
    if (props.companyId && props.projectId) {
      load(props.getRooms);
    }
  }, [props.companyId, props.projectId]);

  // get roomId and view option from query
  useEffect(() => {
    const query = new URLSearchParams(props.location.search);
    const view = query.get('view') && query.get('view') === 'mobile' ? 'mobile' : 'default';
    const roomId = query.get('roomId') ? query.get('roomId')! : '';
    setQueries({ view, roomId });
  }, [props.location.search]);

  // fetch room infos
  useEffect(() => {
    if (!isEmpty(queries.roomId) && props.pusherInstance !== undefined) {
      if (!isEmpty(props.currentRoom._id)) {
        props.pusherInstance.unsubscribe(props.currentRoom._id);
        props.pusherInstance.unsubscribe(`presence-${props.currentRoom._id}`);
      }
      roomSwitch(queries.roomId);
    }
  }, [queries.roomId, props.pusherInstance]);

  return (
    <div className="flex h-100 w-100">
      {queries.view === 'default' && (
        <div
          className="overflow-hidden t-25-a bg-white br b--tigrowLightGray-1"
          style={{
            borderBottomLeftRadius: '0.5rem',
            width: isOpenLeftSidebar ? '220px' : '16px',
          }}
          // TODO: mouse active
          // onMouseEnter={() => !isOpenLeftSidebar && setIsOpenLeftSidebar(true)}
          // onMouseLeave={() => isOpenLeftSidebar && setIsOpenLeftSidebar(false)}
        >
          <RoomSideBar isOpen={isOpenLeftSidebar} />
        </div>
      )}
      <div className="relative flex justify-center items-center flex-grow-1">
        {queries.view === 'default' && (
          <Icon
            className="absolute top-0 pa1 z-3 br2 bg-tigrowLightBlue c-tigrowWhite left--12 pointer"
            icon={isOpenLeftSidebar ? 'arrow-left' : 'arrow-right'}
            iconSize={17}
            onClick={() => setIsOpenLeftSidebar(!isOpenLeftSidebar)}
          />
        )}
        {isEmpty(props.currentRoom.name) === false &&
          isEmpty(props.currentRoom._id) === false &&
          queries.view === 'default' && (
            <Icon
              className="absolute top-0 pa1 z-3 br2 bg-tigrowLightBlue c-tigrowWhite right--12 pointer"
              icon={isOpenRightSidebar ? 'arrow-right' : 'arrow-left'}
              iconSize={17}
              onClick={() => setIsOpenRightSidebar(!isOpenRightSidebar)}
            />
          )}
        <ChatLayout />
      </div>
      {isEmpty(props.currentRoom.name) === false &&
        isEmpty(props.currentRoom._id) === false &&
        queries.view === 'default' && (
          <div
            className="overflow-hidden t-25-a bg-white b--tigrowLightGray-1 bl"
            style={{
              borderBottomRightRadius: '0.5rem',
              width: isOpenRightSidebar ? '400px' : '16px',
            }}
          >
            <RoomRightSidebar isOpen={isOpenRightSidebar} />
          </div>
        )}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentRoom: state.roomReducer.currentRoom,
    companyId: state.companyReducer.currentCompany._id,
    projectId: state.projectReducer.projectDetails._id,
    rooms: state.roomReducer.rooms,
    pusherInstance: state.pusherReducer.pusherInstance,
  };
};

export const RoomPage = connect(mapStateToProps, {
  getRoomMembers,
  getRoomMessages,
  getRooms,
  getRoomSharedFiles,
  getRoomDiscussions,
  getRoom,
})(withRouter(RoomPageComponent));
