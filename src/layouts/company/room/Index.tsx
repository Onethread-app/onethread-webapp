import React, { useState, useEffect } from 'react';
import { Icon } from '@blueprintjs/core';
import { RoomSideBar } from 'layouts/company/room/leftSidebar/Index';
import { ChatLayout } from 'layouts/company/room/chatLayout/Index';
import { connect, useDispatch } from 'react-redux';
import {
  IRoomReducer,
  IRoom,
  IRoomMessage
} from 'stores/room/Reducer';
import { isEmpty } from 'lodash';
import { RoomRightSidebar } from './rightSIdebar/Index';
import {
  NEW_MESSAGE,
  ON_PRESENCE_CHANGE,
  ON_USER_STARTED_TYPING,
  ON_USER_STOPPED_TYPING,
  REFRESH_MEMBER,
  ACTIVE_ROOM
} from 'stores/room/Types';
import {
  getRoomMembers,
  getRoomMessages,
  getRooms,
  getRoomSharedFiles,
  getRoomDiscussions,
  getRoom
} from 'stores/room/Actions';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { roomSubscribe } from './channelSubscribe';
import Pusher from 'pusher-js';

// tslint:disable-next-line: no-var-requires
const { withChatkit } = require('@pusher/chatkit-client-react');

export interface RoomQueries {
  view: 'default' | 'mobile';
  roomId: string;
}

interface RoomPageComponentProps extends RouteComponentProps {
  currentRoom: IRoomReducer['currentRoom'];
  chatkit?: any;
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

const RoomPageComponent = withChatkit((props: RoomPageComponentProps) => {
  const [isOpenLeftSidebar, setIsOpenLeftSidebar] = useState(true);
  const [isOpenRightSidebar, setIsOpenRightSidebar] = useState(true);
  const [queries, setQueries] = useState<RoomQueries>({
    view: 'default',
    roomId: ''
  });

  const dispatch = useDispatch();

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
      // subscribeToRoom(roomId);
    }
  };

  const subscribeToRoom = async (roomId: string) => {
    props.chatkit.currentUser
      .subscribeToRoomMultipart({
        roomId: roomId.toString(),
        hooks: {
          onMessage: (newMessage: any) => {
            const content = JSON.parse(newMessage.parts[0].payload.content);

            const formatMessage: IRoomMessage = {
              type: content.message.type,
              files: content.files,
              removed: content.message.removed,
              _id: content.message._id,
              text: content.message.text,
              room: content.message.room,
              discussion: content.message.discussion,
              account: content.account,
              chatkitId: newMessage.id,
              createdAt: newMessage.createdAt,
              updatedAt: newMessage.updatedAt
            };

            dispatch({ type: NEW_MESSAGE, payload: formatMessage });
          },
          onPresenceChanged: (state: any, user: any) => {
            dispatch({ type: ON_PRESENCE_CHANGE });
          },
          onUserStartedTyping: (user: any) => {
            dispatch({
              type: ON_USER_STARTED_TYPING,
              payload: { name: user.name, roomId }
            });
          },
          onUserStoppedTyping: (user: any) => {
            dispatch({
              type: ON_USER_STOPPED_TYPING,
              payload: { name: user.name, roomId }
            });
          },
          onUserJoined: (user: any) => {
            dispatch({ type: REFRESH_MEMBER });
          },
          onUserLeft: (user: any) => {
            // console.log("left : " + user.name);
          }
        },
        messageLimit: 1
      })
      .then((pusherRoom: any) => {
        dispatch({ type: ACTIVE_ROOM, payload: pusherRoom });
      })
      .catch((err: any) => {
        subscribeToRoom(roomId);
      });
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
    const view =
      query.get('view') && query.get('view') === 'mobile'
        ? 'mobile'
        : 'default';
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
            width: isOpenLeftSidebar ? '220px' : '16px'
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
              width: isOpenRightSidebar ? '400px' : '16px'
            }}
          >
            <RoomRightSidebar isOpen={isOpenRightSidebar} />
          </div>
        )}
    </div>
  );
});

const mapStateToProps = (state: any) => {
  return {
    currentRoom: state.roomReducer.currentRoom,
    companyId: state.companyReducer.currentCompany._id,
    projectId: state.projectReducer.projectDetails._id,
    rooms: state.roomReducer.rooms,
    pusherInstance: state.roomReducer.pusherInstance
  };
};

export const RoomPage = connect(mapStateToProps, {
  getRoomMembers,
  getRoomMessages,
  getRooms,
  getRoomSharedFiles,
  getRoomDiscussions,
  getRoom
})(withRouter(RoomPageComponent));
