import React, { useEffect } from 'react'
import { RoomListItem } from "./RoomListItem";
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface RoomEntity {
  id: string,
  roomImg: string,
  roomTitle: string
}
interface RoomListComponentProps {
  rooms: RoomEntity[],
  chatkit?: any,
}

export const RoomListComponent = (props: RoomListComponentProps & RouteComponentProps) => {
  useEffect(() => {
  }, []);
  return (
    <>
      <main className="mw6 center">
        {props.rooms.map(room => {
          return (
            <RoomListItem key={room.id}
              roomImg={room.roomImg}
              roomTitle={room.roomTitle}
            />
          );
        })}
      </main>
    </>
  )
}

const mapStateToProps = (state: any) => {
  return {
    chatkit: state.chatkit,
  };
};

export const RoomList = connect(mapStateToProps, null)(withRouter(RoomListComponent));