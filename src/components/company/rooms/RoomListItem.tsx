import * as React from 'react';

interface RoomListItemProps {
  roomId: string;
  name: string;
  img: string;
  lastChild: boolean;
  active: string;
  unreadCount: number;
  subscribeToRoom: (roomId: string, name: string) => void;
}

export const RoomListItem = (props: RoomListItemProps) => {
  return (
    <article
      onClick={() => {
        props.subscribeToRoom(props.roomId, props.name);
      }}
      id="roomListItem"
      className={`flex items-center ph3 pv1 bb b--tigrowLightGray-1 pointer ${props.active} ${props.lastChild ? "bn" : ""}`} >
      <div className="dn db-ns pr3">
        <span className="ba b--black-10 db w1 w2-ns h1 h2-ns br3 tc lh-2 bg-light-gray">{props.img}</span>
      </div>
      <div className="flex justify-around items-center">
        <h1 className="f7 f6-ns fw4 mv0">{props.name}
        </h1>
        {props.unreadCount > 0 ? (
          <span className="bg-tigrowLightBlue white br-100 pa1 fw8 ml2">{props.unreadCount}</span>
        ) : null}
      </div>
    </article>
  )
}