import * as React from 'react';
import { useSelector, connect } from 'react-redux';
import moment from 'moment';
import Linkify from 'react-linkify';

import { IRoomMessage } from 'stores/room/Reducer';
import { toggleDiscussionRoom } from 'stores/room/Actions';

import UserIcon from './../../../../../resources/images/profilePhoto.svg';
import DownloadIcon from './../../../../../resources/images/Download.svg';
import starIcon from './../../../../../resources/images/colorful-star.svg';
import muteStarIcon from './../../../../../resources/images/mute-star.svg';

// import { handleDownload } from 'helpers/FileDownload';
interface MessageItemProps {
  message: IRoomMessage;
  group: {
    message: boolean;
    showPicAndName: boolean;
  };
  toggleDiscussionRoom: (
    data: { discussion: boolean },
    messageId: string,
  ) => void;
}

const MessageItemComponent = (props: MessageItemProps) => {
  const user = useSelector((state: any) => state.userReducer.user);
  const currentUser = user._id === props.message.account._id;
  return (
    <>
      {/* date & time */}
      {props.group.showPicAndName ? (
        <div className="flex justify-center items-center pv2">
          <small className="tigrow-darkGray">
            {moment(props.message.createdAt).format('MMM DD')}
          </small>
        </div>
      ) : undefined}

      {/* user info */}
      {props.group.showPicAndName ? (
        <article
          key={props.message._id}
          className={`db flex ml3 items-center mb1 
        ${currentUser ? ' flex-row-reverse' : ''}`}
        >
          {currentUser ? undefined : (
            <>
              <img
                src={
                  props.message.account.profileImage
                    ? props.message.account.profileImage
                    : UserIcon
                }
                className="v-mid dib br-100"
                alt="user"
                style={{
                  width: '32px',
                  height: '32px',
                  objectFit: 'cover',
                }}
              />
              <h5
                className="mv0 ml2 mr2"
                style={{
                  textTransform: 'capitalize',
                }}
              >
                {props.message.account.firstName +
                  ' ' +
                  props.message.account.lastName}
              </h5>
              <small className="tigrow-darkGray">
                {moment(props.message.createdAt).format('h:m a')}
              </small>
            </>
          )}
        </article>
      ) : null}

      {/* text */}
      {props.message.text ? (
        <article
          key={props.message.createdAt}
          // tslint:disable-next-line: max-line-length
          className={`message-text db flex items-center ${
            currentUser ? 'flex-row-reverse' : ''
          } ${props.group.message ? 'mb1' : 'mb3'}`}
          style={{
            marginLeft: '48px',
            fontSize: '15px',
          }}
        >
          <div
            className={`ph3 pv1 br4 mw7 ${
              currentUser ? 'message-mine mr2' : 'message-others ml2'
            }`}
            style={{
              backgroundColor: currentUser ? '#3b5998' : '#d4d4d47a',
            }}
          >
            <Linkify
              componentDecorator={(
                decoratedHref,
                decoratedText,
                key,
              ) => (
                <a
                  target="blank"
                  href={decoratedHref}
                  key={key}
                  rel="noreferrer"
                  style={{
                    color: currentUser ? '#fff' : '#106ba3',
                    textDecoration: 'underline',
                  }}
                >
                  {decoratedText}
                </a>
              )}
            >
              <p
                className={`mv0 tj break-word`}
                style={{
                  color: currentUser ? 'white' : 'rgb(74, 73, 73)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {props.message.text}
              </p>
            </Linkify>
          </div>
          <span
            className={`highlighted-icon ph3 ${
              props.message.discussion ? 'flex' : 'dn'
            }`}
          >
            <img
              className="pointer"
              onClick={async () => {
                await props.toggleDiscussionRoom(
                  { discussion: !props.message.discussion },
                  props.message._id,
                );
              }}
              src={props.message.discussion ? starIcon : muteStarIcon}
              alt="highlighted-discussion icon"
              style={{
                width: '23px',
                height: '23px',
              }}
            />
          </span>
        </article>
      ) : null}

      {/* file */}
      {props.message.files.length
        ? props.message.files.map((file) => (
            <article
              key={file._id}
              className={`db flex items-center ${
                currentUser ? ' flex-row-reverse' : ''
              }
            ${props.group.message ? 'mb1' : 'mb3'}`}
              style={{
                marginLeft: '48px',
                fontSize: '1.2rem',
              }}
            >
              <div
                className={`ph3 pv2 br3 mw7 ${
                  currentUser ? 'mr2' : 'ml2'
                } flex justify-center items-center`}
                style={{
                  backgroundColor: currentUser
                    ? '#3b5998'
                    : '#d4d4d47a',
                }}
              >
                <h4
                  className="mv0 flex justify-center items-center break-word"
                  style={{
                    color: currentUser ? 'white' : 'rgb(74, 73, 73)',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {file.s3Key.split('/')[1]}
                </h4>
                <a
                  href={file.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  <span
                    className="flex pl3 pointer"
                    // onClick={() => handleDownload(file)}
                  >
                    <img
                      src={DownloadIcon}
                      alt="Download icon"
                      style={{
                        width: '23px',
                        height: '23px',
                      }}
                    />
                  </span>
                </a>
              </div>
            </article>
          ))
        : null}
    </>
  );
};
export const MessageItem = connect(null, { toggleDiscussionRoom })(
  MessageItemComponent,
);
