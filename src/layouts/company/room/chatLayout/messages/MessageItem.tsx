import * as React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Classes, Tooltip, Position } from '@blueprintjs/core';

interface MessageItemProps {
  img: string;
  text: string;
  createdAt: string;
  sender: { id: string, name: string };
}

export const MessageItem = (props: MessageItemProps) => {
  const user = useSelector((state: any) => state.userReducer.user);
  const currentUser = user._id == props.sender.id;
  return (
    <article
      className={`flex mb3 mh3 items-center flex ${currentUser ? " flex-row-reverse" : ""}`}
    >
      {currentUser ? undefined : <div className="" style={{ minWidth: "35px", maxWidth: "35px" }}>
        <img src={props.img} className=" br3" />
      </div>}


      <Tooltip
        className={`shadow-4 ph3 pv1 br4 mw6 ${currentUser ? "message-mine mr2 bg-tigrowLightBlue" : "message-others ml2 bg-white"}`}
        content={moment(props.createdAt).format('lll')}
        position="left"
      >
        <div
        // className={`shadow-4 ph3 pv1 br4 ${currentUser ? "message-mine mr2 bg-tigrowLightBlue" : "message-others ml2 bg-white"}`}
        // style={{ maxWidth: "65%" }}
        >
          <h6 className="ma0">
            {props.sender.name}
          </h6>
          <h2
            className={`f6 fw3 ma0 mt1 tj ${currentUser ? "white" : "c-message-from"} break-word`}
            style={{ whiteSpace: "pre-wrap" }}
          >{props.text}
          </h2>
          {/* <div className={`flex ${currentUser ? " flex-row-reverse" : ""}`}>
          <h6 className={`pa0 ma0 mt1 ${currentUser ? "ml5 white" : "mr5"}`}>
            {moment(props.createdAt).format('lll')}
          </h6>
        </div> */}
        </div>
      </Tooltip>
    </article>
  )
}