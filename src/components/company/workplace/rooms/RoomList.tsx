import React from 'react'
import { RoomListItem } from "./RoomListItem";
export const RoomList = () => {
  return (
    <>
      <main className="mw6 center">
        <RoomListItem
          roomImg="http://mrmrs.github.io/photos/p/2.jpg"
          roomTitle="Young Gatchell"
        />
        <RoomListItem
          roomImg="http://mrmrs.github.io/photos/p/3.jpg"
          roomTitle="Arnoldo Degraff"
        />
        <RoomListItem
          roomImg="http://mrmrs.github.io/photos/p/4.jpg"
          roomTitle="Deirdre Lachance"
        />
      </main>
    </>
  )
}
