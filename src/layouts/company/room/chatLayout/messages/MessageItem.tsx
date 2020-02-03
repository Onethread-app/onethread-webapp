import * as React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Tooltip } from '@blueprintjs/core';
import { IRoomMessage, IRoomFile } from 'stores/room/Reducer';
import UserIcon from './../../../../../resources/images/profilePhoto.svg';

interface MessageItemProps {
  text: string;
  files: IRoomFile[];
  createdAt: string;
  sender: IRoomMessage['account'];
}

export const MessageItem = (props: MessageItemProps) => {
  const user = useSelector((state: any) => state.userReducer.user);
  const currentUser = user._id === props.sender._id;
  return (
    <article
      className={`flex mb3 mh3 items-center flex ${currentUser ? ' flex-row-reverse' : ''}`}
    >
      {currentUser ? undefined :
        <img
          src={props.sender.profileImage ?
            props.sender.profileImage.link : UserIcon}
          className="v-mid dib br-100"
          alt="user"
          style={{
            width: '2rem',
            height: '2rem',
            objectFit: 'cover'
          }}
        />}

      <Tooltip
        // tslint:disable-next-line: max-line-length
        className={`shadow-4 ph3 pv1 br4 mw6 ${currentUser ? 'message-mine mr2 bg-tigrowNewDarkBlue' : 'message-others ml2 bg-white'}`}
        content={moment(props.createdAt).format('lll')}
        position="left"
      >
        <div
        // className={`shadow-4 ph3 pv1 br4 ${currentUser ? 
        // "message-mine mr2 bg-tigrowLightBlue" : "message-others ml2 bg-white"}`}
        // style={{ maxWidth: "65%" }}
        >
          {currentUser ? null :
            <h6 className="ma0"
              style={{
                textTransform: 'capitalize'
              }}
            >
              {props.sender.firstName + ' ' + props.sender.lastName}
            </h6>}
          <h2
            className={`f6 fw6 ma0 tj break-word`}
            style={{
              color: currentUser ? 'white' : 'rgb(74, 73, 73)',
              whiteSpace: 'pre-wrap'
            }}
          >{props.text}
          </h2>
          {props.files.length ?
            props.files.map(file =>
              <p><a href={file.link} target="_blank" className="white">{file.s3Key.split('/')[1]}</a></p>
            )
            : null
          }
          {/* <div className={`flex ${currentUser ? " flex-row-reverse" : ""}`}>
          <h6 className={`pa0 ma0 mt1 ${currentUser ? "ml5 white" : "mr5"}`}>
            {moment(props.createdAt).format('lll')}
          </h6>
        </div> */}
        </div>
      </Tooltip>
    </article>
  );
};