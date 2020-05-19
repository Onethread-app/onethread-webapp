import React, { useState, useEffect } from 'react';
import { Icon, Drawer } from '@blueprintjs/core';
import { RoomSideBar } from 'layouts/company/room/leftSidebar/Index';
import { ChatLayout } from 'layouts/company/room/chatLayout/Index';
import { connect, useDispatch } from 'react-redux';
import { IRoomReducer, IRoom } from 'stores/room/Reducer';
import { isEmpty, isEqual } from 'lodash';
import { RoomRightSidebar } from './rightSIdebar/Index';
import {
  getRoomMembers,
  getRoomMessages,
  getRooms,
  getRoomSharedFiles,
  getRoomDiscussions,
  updateLastSeen,
} from 'stores/room/Actions';
import { 
  getSingleProject,
  setCurrentProjectId,
  getRoleForProject,
} from '../../../stores/project/Actions';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Pusher from 'pusher-js';
import { isMobileOnly, CustomView, MobileView } from 'react-device-detect';
import { CURRENT_ROOM } from 'stores/room/Types';

export interface RoomQueries {
  view: 'default' | 'mobile';
  roomId: string;
}

interface RoomPageComponentProps extends RouteComponentProps {
  currentRoom: IRoomReducer['currentRoom'];
  companyId: string;
  companyName: string;
  projectId: string;
  rooms: IRoom[];
  getRooms: () => void;
  updateLastSeen: (roomId: string) => void;
  getRoomMembers: (roomId: string) => void;
  getRoomMessages: (
    roomId: string,
    limit?: number,
    skip?: number,
  ) => void;
  getRoomSharedFiles: (
    roomId: string,
    limit?: number,
    skip?: number,
  ) => void;
  getRoomDiscussions: (
    roomId: string,
    limit?: number,
    skip?: number,
  ) => void;
  pusherInstance: Pusher | undefined;
  setShowDialog?: (val: boolean) => void;
  getSingleProject: (pid: string) => void;
  setCurrentProjectId: (pid: string) => void;
  getRoleForProject: (pid: string) => void;
}

const RoomPageComponent = (props: RoomPageComponentProps) => {
  const [isOpenLeftSidebar, setIsOpenLeftSidebar] = useState(true);
  const [isOpenRightSidebar, setIsOpenRightSidebar] = useState(false);
  const [queries, setQueries] = useState<RoomQueries>({
    view: 'default',
    roomId: '',
  });
  const dispatch = useDispatch();

  const load = async (_getRooms: any) => {
    await _getRooms();
  };

  if(isEmpty(props.projectId)){
    const { projectId } = (props.match.params as any);
    props.getSingleProject(projectId);
    props.setCurrentProjectId(projectId);
    props.getRoleForProject(projectId);
  }

  const roomSwitch = async (roomId: string) => {
    const currentRoom = props.rooms.filter((room) =>
      isEqual(room._id, roomId),
    );
    if (currentRoom.length > 0) {
      dispatch({ type: CURRENT_ROOM, payload: currentRoom[0] });
      await props.getRoomMessages(roomId);
      await props.getRoomMembers(roomId);
      await props.getRoomSharedFiles(roomId);
      await props.getRoomDiscussions(roomId);
    }
  };

  // get all rooms
  useEffect(() => {
    if ( !isMobileOnly && props.companyId && props.projectId) {
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

  const callUpdateLastSeen = async (roomId: string) => {
    await props.updateLastSeen(roomId);
  };

  // fetch room infos
  useEffect(() => {
    if (
      !isEmpty(queries.roomId) &&
      props.pusherInstance !== undefined &&
      props.rooms.length > 0
    ) {
      if (!isEmpty(props.currentRoom._id)) {
        callUpdateLastSeen(props.currentRoom._id);
        // props.pusherInstance.unsubscribe(`private-${props.currentRoom._id}`);
        // props.pusherInstance.unsubscribe(`presence-${props.currentRoom._id}`);
      }
      roomSwitch(queries.roomId);
    }
  }, [queries.roomId, props.pusherInstance, props.rooms]);

  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <div
        className={`flex h-100 w-100 ${isMobileOnly ? 'vh-100' : ''}`}
      >
        <CustomView condition={!isMobileOnly}>
          {queries.view === 'default' && (
            <div
              className="overflow-hidden t-25-a bg-white br b--tigrowLightGray-1 h-100"
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
        </CustomView>
        <div className="relative flex justify-center items-center flex-grow-1">
          <CustomView condition={!isMobileOnly}>
            {queries.view === 'default' && (
              <Icon
                className="absolute top-0 pa1 z-3 br2 bg-tigrowLightBlue c-tigrowWhite left--12 pointer"
                icon={isOpenLeftSidebar ? 'arrow-left' : 'arrow-right'}
                iconSize={17}
                onClick={() => setIsOpenLeftSidebar(!isOpenLeftSidebar)}
              />
              )}
          </CustomView>
          <MobileView>
              <Icon
                className="absolute top-0 pa1 z-3 br2 bg-tigrowLightBlue c-tigrowWhite left-0 pointer"
                icon='arrow-left'
                iconSize={17}
                onClick={() => {
                  // tslint:disable-next-line: no-unused-expression
                  props.setShowDialog && props.setShowDialog(false);
                  props.history.push(`/company/${props.companyName}/project/${props.projectId}/room?view=${queries.view}`);
                }}
              />
            {/* <Button
              className="absolute top-0 bp3-minimal outline-0 shadow-0 underline"
              onClick={() => {
                // tslint:disable-next-line: no-unused-expression
                props.setShowDialog && props.setShowDialog(false);
                props.history.push(`/company/${props.companyName}/project/${props.projectId}/room?view=${queries.view}`);
              }}
            >
              Back
            </Button> */}
          </MobileView>
          {isEmpty(props.currentRoom.name) === false &&
            isEmpty(props.currentRoom._id) === false && (
              <Icon
                className="absolute top-0 pa1 z-3 br2 bg-tigrowLightBlue c-tigrowWhite right-0 pointer"
                icon='arrow-right'
                iconSize={17}
                onClick={() => {
                  setIsOpenRightSidebar(!isOpenRightSidebar);
                  setShowDialog(!showDialog);
                }}
              />
            )}
          <ChatLayout />
        </div>
        {isEmpty(props.currentRoom.name) === false &&
          isEmpty(props.currentRoom._id) === false && (
            <div
              className="overflow-hidden t-25-a bg-white b--tigrowLightGray-1 bl"
              style={{
                borderBottomRightRadius: '0.5rem',
                width: isOpenRightSidebar ? isMobileOnly ? '0px' : '400px' : isMobileOnly ? '0px' : '16px',
              }}
            >
              {isMobileOnly ?
                <Drawer
                  onClose={() => setShowDialog(!showDialog)}
                  isOpen={showDialog}
                  canOutsideClickClose={false}
                  style={{ width: '100%' }}
                  title=""
                >
                  <div>
                    <RoomRightSidebar isOpen={isOpenRightSidebar} />
                  </div>
                </Drawer>
                :
                <RoomRightSidebar isOpen={isOpenRightSidebar} />}
            </div>
          )}
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentRoom: state.roomReducer.currentRoom,
    companyId: state.companyReducer.currentCompany._id,
    projectId: state.projectReducer.projectDetails._id,
    rooms: state.roomReducer.rooms,
    pusherInstance: state.pusherReducer.pusherInstance,
    companyName: state.companyReducer.currentCompany.name
  };
};

export const RoomPage = connect(mapStateToProps, {
  getRoomMembers,
  getRoomMessages,
  getRooms,
  getRoomSharedFiles,
  getRoomDiscussions,
  updateLastSeen,getSingleProject,
  setCurrentProjectId,
  getRoleForProject,
})(withRouter(RoomPageComponent));
