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
  const isBeforeToday = moment(props.message.createdAt).isBefore(
    new Date(),
    'day',
  );
  return (
    <>
      {/* user info */}
      {props.group.showPicAndName ? (
        <article
          key={props.message._id}
          className={`db flex ml3 items-center mb1 
        ${currentUser ? ' flex-row-reverse pr2' : ''}`}
        >
          {/* {currentUser ? undefined : (
            <> */}
          <img
            src={
              props.message.account.profileImage
                ? props.message.account.profileImage
                : UserIcon
            }
            className="v-mid dib"
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
          {/* </>
          )} */}
        </article>
      ) : null}

      {/* text */}
      {props.message.text ? (
        <article
          key={props.message.createdAt}
          // tslint:disable-next-line: max-line-length
          className={`message-text db flex items-center ${
            currentUser ? 'flex-row-reverse mr4' : 'ml4'
          } ${props.group.message ? 'mb1' : 'mb3'}`}
          style={{
            fontSize: '15px',
          }}
        >
          <div
            className={`ph3 pv1 br2 mw7 ${
              currentUser ? ' mr2' : 'ml2'
            }`}
            style={{
              backgroundColor: '#F2F2F2',
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
                    color: '#323030',
                    textDecoration: 'underline',
                  }}
                >
                  {decoratedText}
                </a>
              )}
            >
              <div className="flex justify-between">
                <p
                  className={`mv0 tj break-word`}
                  style={{
                    color: '#323030',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {props.message.text}
                </p>
                <span className="tigrow-darkGray ml3 mt2 f7 mb0">
                  {isBeforeToday === true
                    ? moment(props.message.createdAt).format('h:m a')
                    : moment(props.message.createdAt).fromNow()}
                </span>
              </div>
            </Linkify>
          </div>
          <span
            className={`highlighted-icon ph3 ${
              props.message.discussion ? 'flex' : 'dn'
            }`}
            style={{
              flexShrink: 0,
            }}
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
                currentUser ? ' flex-row-reverse mr4' : 'ml4'
              }
            ${props.group.message ? 'mb1' : 'mb3'}`}
              style={{
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
