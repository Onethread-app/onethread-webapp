import * as React from 'react';
import { useSelector } from 'react-redux';
import { IRoomMessage, IRoomFile } from 'stores/room/Reducer';
import UserIcon from './../../../../../resources/images/profilePhoto.svg';
import DownloadIcon from './../../../../../resources/images/Download.svg';

interface MessageItemProps {
  text: string;
  files: IRoomFile[];
  createdAt: string;
  group: {
    message: boolean;
    showPicAndName: boolean;
  };
  sender: IRoomMessage['account'];
}

export const MessageItem = (props: MessageItemProps) => {
  const user = useSelector((state: any) => state.userReducer.user);
  const currentUser = user._id === props.sender._id;
  return (
    <>
      {props.group.showPicAndName ? <article
        className={`db flex ml3 items-center mb1 
        ${currentUser ? ' flex-row-reverse' : ''}`}
      >
        {currentUser ? undefined :
          <>
            <img
              src={props.sender.profileImage ?
                props.sender.profileImage.link : UserIcon}
              className="v-mid dib br-100"
              alt="user"
              style={{
                width: '32px',
                height: '32px',
                objectFit: 'cover'
              }}
            />
            <h5 className="mv0 ml2"
              style={{
                textTransform: 'capitalize'
              }}
            >
              {props.sender.firstName + ' ' + props.sender.lastName}
            </h5>
          </>
        }
      </article> : null}

      {props.text ? <article
        className={`db flex items-center flex 
        ${currentUser ? ' flex-row-reverse' : ''} 
        ${props.group.message ? 'mb1' : 'mb3'}`}
        style={{
          marginLeft: '48px'
        }}
      >
        {/* <Tooltip
        // tslint:disable-next-line: max-line-length
        className={`shadow-4 ph3 pv1 br4 mw6 ${currentUser ? 
          'message-mine mr2 bg-tigrowNewDarkBlue' : 'message-others ml2 bg-white'}`}
        content={moment(props.createdAt).format('lll')}
        position="left"
      > */}
        <div
          className={`ph3 pv1 br4 mw6 ${currentUser ? 'message-mine mr2' : 'message-others ml2'}`}
          style={{
            backgroundColor: currentUser ?
              '#3b5998' : '#d4d4d47a'
          }}
        >
          <p
            className={`mv0 tj break-word`}
            style={{
              color: currentUser ? 'white' : 'rgb(74, 73, 73)',
              whiteSpace: 'pre-wrap'
            }}
          >{props.text}
          </p>
          {/* <div className={`flex ${currentUser ? " flex-row-reverse" : ""}`}>
          <h6 className={`pa0 ma0 mt1 ${currentUser ? "ml5 white" : "mr5"}`}>
            {moment(props.createdAt).format('lll')}
          </h6>
        </div> */}
        </div>
        {/* </Tooltip> */}
      </article> : null}

      {props.files.length ?
        props.files.map(file =>
          <article
            className={`db flex items-center flex ${currentUser ? ' flex-row-reverse' : ''}
            ${props.group.message ? 'mb1' : 'mb3'}`}
            style={{
              marginLeft: '48px'
            }}
          >
            <div
              className={`ph3 pv2 br3 mw6 ${currentUser ? 'mr2' : 'ml2'} flex justify-center items-center`}
              style={{
                backgroundColor: currentUser ?
                  '#3b5998' : '#d4d4d47a'
              }}
            >
              <h4
                className="mv0 flex justify-center items-center"
                style={{
                  color: currentUser ? 'white' : 'rgb(74, 73, 73)',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {file.s3Key.split('/')[1]}
              </h4>
              <a
                href={file.link}
                target="_blank"
                rel="noopener noreferrer"
                download>
                <span className="flex pl3">
                  <img
                    src={DownloadIcon}
                    alt="Download icon"
                    style={{
                      width: '23px',
                      height: '23px'
                    }}
                  />
                </span>
              </a>
            </div>
          </article>
        )
        : null
      }
    </>
  );
};