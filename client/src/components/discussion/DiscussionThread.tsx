import { useEffect, useRef, useState } from 'react';
import { Icon } from '@blueprintjs/core';
import moment from 'moment';
import { connect, useDispatch } from 'react-redux';

import {
  getRoomMessages,
  updateLastSeen,
  toggleDiscussionRoom,
} from 'stores/room/Actions';
import {
  IRoom,
  IRoomPendingFile,
  IRoomReducer,
} from 'stores/room/Reducer';
import {
  ALL_MESSAGE_RECEIVED,
  DELETE_ONE_PENDING_FILE,
} from 'stores/room/Types';
import { User } from 'stores/user/Reducer';

import { CircularProgress } from '@material-ui/core';
import {
  CommentContainer,
  DiscussionContainer,
  StyledImage,
} from './ProjectDiscussion.styles';
import { Avatar } from 'components/updatedNavbar/Navbar.styles';
import { Loading } from 'components/Loading';
import CommentBox from './CommentBox';
import CommentItem from './CommentItem';

interface Props {
  user: User;
  updateLastSeen: (roomId: string) => void;
  getRoomMessages: (
    roomId: string,
    limit?: number,
    skip?: number,
  ) => void;
  messages: IRoomReducer['messages'];
  allMessages: boolean;
  currentRoom: IRoom;
  toggleDiscussionRoom: (
    data: { discussion: boolean },
    messageId: string,
  ) => void;
  pendingFiles: IRoomPendingFile[];
  uploadingFile: boolean;
  errorOnFileUpload: string;
}

export const StyledAvatar = ({ profilePic, name }) => {
  return profilePic ? (
    <StyledImage src={profilePic} alt={name} />
  ) : (
    <Avatar>{name}</Avatar>
  );
};

const DiscussionThread = (props: Props) => {
  const { currentRoom } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [first, setFirst] = useState(false);
  const [limit, setLimit] = useState(15);
  const [skip, setSkip] = useState(0);
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const callUpdateLastSeen = async (roomId: string) => {
    props.updateLastSeen(roomId);
  };

  const scrollToBottom = () => {
    // TODO send message read trigger
    if (props.messages.length) {
      callUpdateLastSeen(currentRoom._id);
    }

    // On new message, scroll to bottom
    if (
      messagesEndRef &&
      messagesEndRef.current &&
      messagesEndRef.current.scrollTop +
        messagesEndRef.current.clientHeight +
        messagesEndRef.current.clientHeight * 0.3 >=
        messagesEndRef.current.scrollHeight
    ) {
      messagesEndRef.current.scrollTop =
        messagesEndRef.current.scrollHeight;
    }

    // On enter the room, scroll to bottom
    if (messagesEndRef && messagesEndRef.current && !first) {
      messagesEndRef.current.scrollTop =
        messagesEndRef.current.scrollHeight;
      setFirst(true);
    }
  };

  const loadMoreMessages = async () => {
    if (props.allMessages === false && currentRoom) {
      const n = skip + limit;
      setSkip(n);
      props.getRoomMessages(currentRoom._id, limit, n);
    }
  };

  const groupMessages = async () => {
    const messages = props!.messages;
    const groups = messages.reduce((groups, message) => {
      const date = moment(message.createdAt).format('MMM DD');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});

    const groupArrays = Object.keys(groups).map((date) => {
      return {
        date,
        messages: groups[date],
      };
    });

    setAllMessages(groupArrays);
  };

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    if (currentRoom?._id) {
      setLoading(false);
    }
  }, [currentRoom]);

  useEffect(() => {
    setFirst(false);
    setLimit(15);
    setSkip(0);
    dispatch({ type: ALL_MESSAGE_RECEIVED, payload: false });
  }, [currentRoom?._id]);

  useEffect(scrollToBottom, [props.messages]);

  useEffect(() => {
    groupMessages();
  }, [props!.messages]);
  return (
    <DiscussionContainer>
      <div className="message-container" ref={messagesEndRef}>
        {loading ? <Loading /> : null}
        {loading === false ? (
          <>
            {props.allMessages === false &&
            props.messages.length > 0 ? (
              <div
                className="flex justify-center items-center"
                onClick={loadMoreMessages}
              >
                <h6
                  className="pv1 ph2 mv0 white br2 pointer flex justify-center items-center"
                  style={{
                    backgroundColor: 'rgb(92, 108, 142)',
                  }}
                >
                  <Icon icon="upload" iconSize={18} />
                  <span
                    style={{
                      fontSize: '11px',
                      marginLeft: '6px',
                    }}
                  >
                    load more
                  </span>
                </h6>
              </div>
            ) : undefined}
            {allMessages.length
              ? allMessages.map((group, index) => (
                  <div key={index}>
                    <div className="flex justify-center gray">
                      {group.date}
                    </div>
                    {group.messages.length
                      ? group.messages.map((message) => (
                          <CommentItem
                            message={message}
                            currentUser={
                              props.user._id === message.account._id
                            }
                            key={message._id}
                          />
                        ))
                      : null}
                  </div>
                ))
              : null}
          </>
        ) : null}
      </div>
      {props.currentRoom.archive === false ? (
        <>
          <div
            className={`${
              props.uploadingFile === true ||
              props.errorOnFileUpload !== '' ||
              props.pendingFiles?.length > 0
                ? 'flex w-100 flex-wrap items-center b--black-10 ba'
                : 'dn'
            }`}
          >
            {props.uploadingFile ? (
              <CircularProgress
                size={25}
                style={{ margin: '.5rem' }}
              />
            ) : props.errorOnFileUpload ? (
              <div>There was an error uploading file</div>
            ) : props.pendingFiles && props.pendingFiles.length ? (
              props.pendingFiles.map((file) => (
                <div
                  className="bg-tigrowLightBlue flex pv2 ph3 ma1 br-pill justify-center items-center"
                  key={file._id}
                >
                  <p className="white ma0">
                    {file.s3Key.split('/')[1]}
                  </p>
                  <span
                    className="bp3-tag-remove bp3-icon-delete mh2 w1 h1"
                    style={{
                      backgroundColor: 'white',
                      color: '#08A0F7',
                      borderRadius: '30px',
                      paddingTop: '1px',
                    }}
                    onClick={() => {
                      dispatch({
                        type: DELETE_ONE_PENDING_FILE,
                        payload: file._id,
                      });
                    }}
                  ></span>
                </div>
              ))
            ) : null}
          </div>
          <CommentContainer>
            <StyledAvatar
              name={props.user.firstName.substring(0, 2)}
              profilePic={props.user.profileImage}
            ></StyledAvatar>
            <CommentBox />
          </CommentContainer>
        </>
      ) : (
        <div className="flex justify-center items-center h4">
          <h3 className="fw5 f3">The Room is archived</h3>
        </div>
      )}
    </DiscussionContainer>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.userReducer.user,
  messages: state.roomReducer.messages,
  allMessages: state.roomReducer.allMessages,
  currentRoom: state.roomReducer.currentRoom,
  pendingFiles: state.roomReducer.pendingFiles,
  uploadingFile: state.roomReducer.uploadingFile,
  errorOnFileUpload: state.roomReducer.errorOnFileUpload,
});

export default connect(mapStateToProps, {
  getRoomMessages,
  updateLastSeen,
  toggleDiscussionRoom,
})(DiscussionThread);
