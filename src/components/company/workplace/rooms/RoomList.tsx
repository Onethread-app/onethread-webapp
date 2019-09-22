import React from 'react'
import { RoomListItem } from "./RoomListItem";

type rooms = {
  id: string,
  roomImg: string,
  roomTitle: string
}
interface RoomComponentProps {
  rooms: Array<rooms>;
}

export const RoomList = (props: RoomComponentProps) => {
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
