import * as React from 'react';

interface RoomListItemProps {
  roomId: string;
  name: string;
  img: string;
  lastChild: boolean;
  subscribeToRoom: (roomId: any) => void;
  active: string;
}

export const RoomListItem = (props: RoomListItemProps) => {

  return (
    <article
      onClick={() => {
        props.subscribeToRoom(props.roomId);
      }}
      id="roomListItem"
      className={`dt w-100 ph3 pv1 bb b--tigrowLightGray-1 pointer ${props.active} ${props.lastChild ? "bn" : ""}`} >
      <div className="dtc w1 w2-ns v-mid">
        <span className="ba b--black-10 db w1 w2-ns h1 h2-ns br3 tc lh-2 bg-light-gray">{props.img}</span>
      </div>
      <div className="dtc v-mid pl3">
        <h1 className="f7 f6-ns fw4 lh-title black mv0">{props.name}</h1>
      </div>
    </article>
  )
}