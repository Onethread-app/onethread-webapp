import * as React from 'react';
import { dateFormatter } from "../../helpers/index";
import { useSelector } from 'react-redux';

interface MessageItemProps {
  img: string;
  text: string;
  createdAt: string;
  sender: any;
}

export const MessageItem = (props: MessageItemProps) => {
  const user = useSelector((state: any) => state.userReducer.user);
  const currentUser = user._id == props.sender.id;
  return (
    <article
      className={`flex mb2 items-center flex ${currentUser ? " flex-row-reverse" : ""}`}
    >
      <div className="" style={{ minWidth: "35px", maxWidth: "35px" }}>
        <img src={props.img} className=" br3" />
      </div>
      <div
        className={`shadow-1 pa3 pt1 br3 ${currentUser ? "mr2 bg-tigrowLightBlue" : "ml2 bg-white"}`}
        style={{ width: "auto" }}>
        <div className={`flex justify-between ${currentUser ? " flex-row-reverse" : ""}`}>
          <h6 className="pa0 ma0">{props.sender.name}</h6>
          <h6 className={`pa0 ma0 ${currentUser ? "mr5" : "ml5"}`}>
            {dateFormatter(new Date(props.createdAt)).format}
          </h6>
        </div>
        <h2 className={`f6 fw3 ma0 mt2 tj ${currentUser ? "white" : " black-60"}`}>{props.text}</h2>
      </div>
    </article>
  )
}