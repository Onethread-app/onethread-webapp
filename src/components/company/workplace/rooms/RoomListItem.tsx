import * as React from 'react';

interface RoomListItemProps {
  name: string;
  img: string;
  lastChild: boolean;
}

export const RoomListItem = (props: RoomListItemProps) => {

  return (
    <article className={`dt w-100 pb1 mt1 bb b--tigrowLightGray-1 ${props.lastChild ? "bn" : ""}`} >
      <div className="dtc w1 w2-ns v-mid">
        <span className="ba b--black-10 db w1 w2-ns h1 h2-ns br3 tc lh-2 bg-light-gray">{props.img}</span>
      </div>
      <div className="dtc v-mid pl3">
        <h1 className="f7 f6-ns fw4 lh-title black mv0">{props.name}</h1>
      </div>
    </article>
  )
}