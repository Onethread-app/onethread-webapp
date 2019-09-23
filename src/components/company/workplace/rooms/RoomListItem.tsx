import * as React from 'react';

interface RoomListItemProps {
  roomImg: string;
  roomTitle: string;
}

export const RoomListItem = (props: RoomListItemProps) => (
  <article className="dt w-100 pb2 mt2" >
    <div className="dtc w1 w2-ns v-mid">
      <img src={props.roomImg} className="ba b--black-10 db w1 w2-ns h1 h2-ns br3" />
    </div>
    <div className="dtc v-mid pl3">
      <h1 className="f7 f6-ns fw4 lh-title black mv0">{props.roomTitle}</h1>
    </div>
  </article>
)