import * as React from 'react';

interface RoomListItemProps {
  roomImg: string;
  roomTitle: string;
  lastChild: boolean;
}

export const RoomListItem = (props: RoomListItemProps) => {

  let bb = props.lastChild ? "bn" : "";

  return (
    <article className={`dt w-100 pl2 pb3 mt3 bb b--tigrowLightGray-1 ${bb}`} >
      <div className="dtc w1 w2-ns v-mid">
        {/* <img src={props.roomImg} className="ba b--black-10 db w1 w2-ns h1 h2-ns br3" /> */}
        <span className="ba b--black-10 db w1 w2-ns h1 h2-ns br3 tc lh-2 bg-light-gray">{props.roomTitle[0]}</span>
      </div>
      <div className="dtc v-mid pl3">
        <h1 className="f7 f6-ns fw4 lh-title black mv0">{props.roomTitle}</h1>
      </div>
    </article>
  )
}